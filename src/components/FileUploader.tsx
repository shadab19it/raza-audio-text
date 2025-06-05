import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText, FileAudio, FileArchive, AlertCircle } from "lucide-react";
import { useApiKey } from "../contexts/ApiKeyContext";
import { useConversion } from "../contexts/ConversionContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import OpenAI from "openai";

const ACCEPTED_FILE_TYPES = {
  "audio/mpeg": [".mp3"],
  "audio/wav": [".wav"],
  "audio/x-wav": [".wav"],
  "audio/mp3": [".mp3"],
  "audio/x-m4a": [".m4a"],
  "audio/aac": [".aac"],
  "audio/flac": [".flac"],
  "audio/ogg": [".ogg"],
  "audio/x-ms-wma": [".wma"],
  "audio/webm": [".webm"],
  "audio/amr": [".amr"],
  "audio/3gpp": [".3gp"],
  "audio/3gpp2": [".3g2"],
  "audio/midi": [".midi", ".mid"],
  "audio/x-aiff": [".aiff", ".aif"],
  "audio/vnd.wave": [".wav"],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const { apiKey, isApiKeyValid } = useApiKey();
  const { setConvertedText, isConverting, setIsConverting, conversionProgress, setConversionProgress, addToHistory } = useConversion();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const selectedFile = acceptedFiles[0];

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      return;
    }

    setFile(selectedFile);
    setFileError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === "file-invalid-type") {
        setFileError("Unsupported file type. Please upload MP3, WAV, PDF, DOC, or DOCX files.");
      } else if (error?.code === "file-too-large") {
        setFileError(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      } else {
        setFileError("There was an error with your file. Please try again.");
      }
    },
  });

  const removeFile = () => {
    setFile(null);
    setFileError(null);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("audio")) {
      return <FileAudio className='w-12 h-12 text-primary-500' />;
    } else if (fileType.includes("pdf")) {
      return <FileText className='w-12 h-12 text-error-500' />;
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return <FileArchive className='w-12 h-12 text-secondary-500' />;
    }
    return <FileText className='w-12 h-12 text-gray-500' />;
  };

  const processFile = async () => {
    if (!file) return;
    if (!isApiKeyValid) {
      toast.error("Please add a valid OpenAI API key in settings first!");
      return;
    }

    try {
      setIsConverting(true);
      setConversionProgress(10);

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

      let extractedText = "";

      if (file.type.includes("audio")) {
        setConversionProgress(30);

        // OpenAI Whisper API does not natively support a system prompt,
        // but you can provide an initial prompt for context using the 'prompt' parameter.
        // For example, you can guide the transcription style or context:
        const response = await openai.audio.transcriptions.create({
          file: file,
          model: "whisper-1",
          prompt: `
          Transcribe the following audio call. It's a sales conversation between a sales representative and a customer.

Requirements:

Include timestamps at the start of each speaker’s sentence (e.g., [00:01:12])

          
          `,
          response_format: "verbose_json",
        });

        // If segments are available, format with timestamps
        if (response.segments && Array.isArray(response.segments)) {
          extractedText = response.segments
            .map((seg: any) => `[${new Date(seg.start * 1000).toISOString().substr(11, 8)}] ${seg.text.trim()}`)
            .join("\n");
        } else {
          extractedText = response.text;
        }
      }

      setConversionProgress(90);
      setConvertedText(extractedText);

      // Add to history
      addToHistory({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        convertedText: extractedText,
      });

      setConversionProgress(100);
      setTimeout(() => {
        setIsConverting(false);
        setFile(null);
        toast.success("Conversion completed!");
      }, 500);
    } catch (error) {
      console.error("Error processing file:", error);
      setIsConverting(false);
      setConversionProgress(0);
      toast.error("Failed to convert file. Please check your API key and try again.");
    }
  };

  return (
    <div className='w-full'>
      <div className='mb-6'>
        <h2 className='text-lg font-medium mb-2'>Upload File</h2>
        <p className='text-gray-600 dark:text-gray-400 text-sm mb-4'>Supported formats: MP3, WAV, PDF, DOC, DOCX (max 50MB)</p>

        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20"
                : "border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600"
            } ${isDragReject ? "border-error-500 bg-error-50 dark:bg-error-900/20" : ""}`}>
            <input {...getInputProps()} />
            <div className='flex flex-col items-center justify-center'>
              <motion.div
                animate={{
                  y: isDragActive ? -5 : 0,
                  scale: isDragActive ? 1.05 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                <Upload
                  size={40}
                  className={`mb-3 ${isDragActive ? "text-primary-500" : "text-gray-400"} ${isDragReject ? "text-error-500" : ""}`}
                />
              </motion.div>

              {isDragActive ? (
                <p className='text-primary-600 dark:text-primary-400 font-medium'>Drop your file here</p>
              ) : isDragReject ? (
                <p className='text-error-600 dark:text-error-400 font-medium'>Unsupported file type</p>
              ) : (
                <>
                  <p className='font-medium mb-1'>Drag & drop your file here</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>or click to browse files</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className='border rounded-lg p-4 bg-white dark:bg-gray-800'>
            <div className='flex items-center'>
              {getFileIcon(file.type)}
              <div className='ml-4 flex-1'>
                <div className='flex items-center justify-between'>
                  <span className='font-medium truncate max-w-xs'>{file.name}</span>
                  <button
                    onClick={removeFile}
                    className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    disabled={isConverting}>
                    <X size={18} />
                  </button>
                </div>
                <span className='text-sm text-gray-500'>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            </div>

            {isConverting ? (
              <div className='mt-4'>
                <div className='relative pt-1'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <span className='text-xs font-medium text-primary-600 dark:text-primary-400'>Converting...</span>
                    </div>
                    <div className='text-right'>
                      <span className='text-xs font-medium text-primary-600 dark:text-primary-400'>{conversionProgress}%</span>
                    </div>
                  </div>
                  <div className='overflow-hidden h-2 mt-1 text-xs flex rounded bg-primary-100 dark:bg-primary-900/30'>
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${conversionProgress}%` }}
                      transition={{ duration: 0.5 }}
                      className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500'
                    />
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={processFile} disabled={!isApiKeyValid} className='btn btn-primary mt-4 w-full'>
                {isApiKeyValid ? "Convert to Text" : "Add API Key in Settings First"}
              </button>
            )}
          </div>
        )}

        {fileError && (
          <div className='mt-3 text-error-500 dark:text-error-400 flex items-center'>
            <AlertCircle size={16} className='mr-2' />
            <span className='text-sm'>{fileError}</span>
          </div>
        )}

        {!isApiKeyValid && !fileError && (
          <div className='mt-3 text-warning-500 dark:text-warning-400 flex items-center'>
            <AlertCircle size={16} className='mr-2' />
            <span className='text-sm'>You need to add your OpenAI API key in Settings before converting files.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
