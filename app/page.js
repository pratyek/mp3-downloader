'use client';

import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './styles/globals.css';

export default function Home() {
  const { t, i18n } = useTranslation();

  // States for the download tool
  const [url, setUrl] = useState('');
  
  const [format, setFormat] = useState('mp4');
  const [isClip, setIsClip] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [downloadId, setDownloadId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  // Languages for selection (9 languages)
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'mr', label: 'मराठी' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'zh', label: '中文' },
  ];

  // Available formats
  const formats = ['mp4', 'mp3', 'mov', 'mkv', 'webm', 'flv'];

  // On page load, check for an ongoing download
  useEffect(() => {
    const storedDownloadId = localStorage.getItem('currentDownloadId');
    if (storedDownloadId) {
      setDownloadId(storedDownloadId);
      const storedUrl = localStorage.getItem('currentVideoUrl');
      if (storedUrl) setUrl(storedUrl);
      setDownloading(true);
      checkProgress(storedDownloadId);
    }
  }, []);

  // Poll download progress
  const checkProgress = async (id) => {
    try {
      const response = await fetch(`/api/download?downloadId=${id}`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      const data = await response.json();
      setProgress(data.progress || 0);
      setStatus(data.status || 'waiting');
      if (data.status === 'completed') {
        setDownloading(false);
        setDownloadReady(true);
      } else if (data.status === 'failed') {
        setDownloading(false);
        setError(data.error || 'Download failed');
        localStorage.removeItem('currentDownloadId');
        localStorage.removeItem('currentVideoUrl');
      } else {
        setDownloading(true);
      }
      return data;
    } catch (error) {
      console.error('Error checking progress:', error);
      setError('Failed to get download status');
      return null;
    }
  };

  useEffect(() => {
    let progressInterval;
    if (downloadId) {
      progressInterval = setInterval(() => {
        checkProgress(downloadId);
      }, 1000);
    }
    return () => progressInterval && clearInterval(progressInterval);
  }, [downloadId]);

  // Start a new download job via the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setDownloadReady(false);
    setDownloading(true);
    setProgress(0);
    setStatus('starting');

    try {
      const downloadData = {
        url,
        format,
        startTime: isClip ? startTime : null,
        endTime: isClip ? endTime : null,
      };
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(downloadData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start download');
      }
      const data = await response.json();
      setDownloadId(data.downloadId);
      localStorage.setItem('currentDownloadId', data.downloadId);
      localStorage.setItem('currentVideoUrl', url);
      if (data.status === 'completed') {
        setDownloading(false);
        setDownloadReady(true);
        setProgress(100);
      }
    } catch (error) {
      console.error('Error starting download:', error);
      setError(error.message || 'Failed to start download');
      setDownloading(false);
    }
  };

  // Reset all states
  const handleReset = () => {
    localStorage.removeItem('currentDownloadId');
    localStorage.removeItem('currentVideoUrl');
    setDownloadId(null);
    setProgress(0);
    setStatus('');
    setError(null);
    setDownloading(false);
    setDownloadReady(false);
    setUrl('');
    setIsClip(false);
    setStartTime('');
    setEndTime('');
  };

  // Download handlers
  const handleDownloadVideo = () => {
    if (downloadId) {
      window.location.href = `/api/download/file?downloadId=${downloadId}`;
    }
  };

  const handleDownloadThumbnail = () => {
    if (url) {
      window.location.href = `/api/thumbnail?url=${encodeURIComponent(url)}`;
    }
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
 
      {/* Header */}
      <header className="bg-gray-800 text-white py-4 shadow">
          <div className="container mx-auto flex items-center justify-between px-4">
            <div className="flex items-center">
              <img src="/favicon.ico" alt="Logo" className="h-10 mr-3" />
              <h1 className="text-2xl font-bold">{t('title')}</h1>
            </div>
            <div>
              <select
                value={i18n.language}
                onChange={handleLanguageChange}
                className="p-2 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              >
                {languages.map((lang) => (
                  <option
                    key={lang.code}
                    value={lang.code}
                    className="bg-white text-black hover:bg-gray-800 hover:text-white transition-all duration-200"
                  >
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gray-800 text-white py-12 shadow">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl text-white-600 md:text-5xl font-bold mb-8">{t('title')}</h2>
            <p className="text-lg text-white-300 md:text-2xl mb-6">
              {t('intro', 'Download and convert YouTube videos quickly and easily in multiple formats.')}
            </p>
          </div>

          <div className="text-center p-6">
            {!downloading && !downloadReady ? (
              <form onSubmit={handleSubmit}>
                {/* URL Input and Download Button */}
                <div className="mb-6 flex justify-center items-center space-x-4">
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="m-0 w-1/3 p-4 border font-semibold text-gray-800 rounded-md focus:ring-2 focus:ring-gray-800 transition"
                    required
                  />
                <button
                    type="submit"
                    className="m-0 py-3 px-3 rounded-md font-bold transition-colors duration-300 ease-in-out bg-white text-gray-800 hover:bg-gray-700 hover:text-white disabled:bg-gray-800 disabled:text-gray-800"
                    disabled={!url || (isClip && (!startTime || !endTime))}
                  >
                    {t('download')}{"->"}
                  </button>

                </div>
                <div className="flex flex-row justify-center items-center space-x-5">
                  {/* Format Selection */}
                  <div className="flex flex-row items-center mb-6 space-x-5 ">
                    <label htmlFor="format" className="block text-gray-100 font-bold text-2xl mb-2">
                      {t('format')}
                    </label>
                    <select
                      id="format"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className=" p-4 text-gray-800 font-bold border rounded-md focus:ring-2 focus:ring-gray-500 transition"
                    >
                      {formats.map((fmt) => (
                        <option key={fmt} value={fmt}>
                          {fmt.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Clip Download Options */}
                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isClip}
                        onChange={(e) => setIsClip(e.target.checked)}
                        className="h-5 w-5 mr-2"
                      />
                      <span className="font-bold text-2xl">{t('downloadClip')}</span>
                    </label>
                  </div>
                </div>



                {/* Start and End Time Inputs */}
                {isClip && (
                  <div className="w-1/2 mx-auto mb-6 grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="startTime" className="block text-gray-100 font-bold mb-2">
                        {t('startTime')}
                      </label>
                      <input
                        type="text"
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        placeholder="00:00:00"
                        pattern="^[0-9]{1,2}:[0-9]{2}:[0-9]{2}$"
                        className="w-full text-gray-800 p-4 border rounded-md focus:ring-2 focus:ring-gray-500 transition"
                        required={isClip}
                      />
                    </div>
                    <div>
                      <label htmlFor="endTime" className="block text-gray-100 font-bold mb-2">
                        {t('endTime')}
                      </label>
                      <input
                        type="text"
                        id="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        placeholder="00:10:00"
                        pattern="^[0-9]{1,2}:[0-9]{2}:[0-9]{2}$"
                        className="w-full text-gray-800 p-4 border rounded-md focus:ring-2 focus:ring-gray-500 transition"
                        required={isClip}
                      />
                    </div>
                  </div>
                )}
              </form>
            ) : downloading ? (
              <div className="flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-4">{t('downloading')}</h3>
              <div className="mb-6 w-1/2">
                {/* Progress Bar */}
                <div className="w-full bg-transparent rounded-full h-5">
                  <div
                    className="bg-white h-5 rounded-full flex items-center justify-end pr-2 text-xs text-white"
                    style={{ width: `${Math.max(progress, 5)}%` }}
                  >
                    {downloading}
                  </div>
                </div>
              </div>
              
              {/* Percentage Below the Progress Bar */}
              <div className="text-white font-bold text-xl mt-2">
                {progress.toFixed(1)}%
              </div>
            
              <button
                onClick={handleReset}
                className="w-1/2 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition mt-4"
              >
                {t('cancel')}
              </button>
            </div>            
            ) : (
              <div >
                <h3 className="text-xl font-bold mb-4 text-green-600">{t('downloadComplete')}</h3>
                <div className="flex flex-col items-center space-y-4">
                  <button
                    onClick={handleDownloadVideo}
                    className="w-1/5 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    {t('downloadVideo')}
                  </button>
                  <button
                    onClick={handleDownloadThumbnail}
                    className="w-1/5 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                  >
                    {t('downloadThumbnail')}
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-1/5 py-3 bg-white text-gray-800 font-bold rounded-md hover:text-gray-100 hover:bg-gray-700 transition"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                <h3 className="font-bold mb-2">{t('error')}:</h3>
                <p>{error}</p>
                <button
                  onClick={handleReset}
                  className="mt-3 px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  {t('tryAgain')}
                </button>
              </div>
            )}
          </div>
        </section>





      {/* Steps Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <img src="/step1.jpeg" alt="Step 1" className="w-full h-40 object-cover rounded mb-4" />
            <h4 className="text-lg font-bold mb-2">{t('step1Title', 'Step 1: Enter URL')}</h4>
            <p className="text-gray-700">{t('step1Desc', 'Paste the YouTube URL into the input field.')}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <img src="/step2.jpeg" alt="Step 2" className="w-full h-40 object-cover rounded mb-4" />
            <h4 className="text-lg font-bold mb-2">{t('step2Title', 'Step 2: Choose Format')}</h4>
            <p className="text-gray-700">{t('step2Desc', 'Select your preferred video or audio format.')}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <img src="/step3.jpeg" alt="Step 3" className="w-full h-40 object-cover rounded mb-4" />
            <h4 className="text-lg font-bold mb-2">{t('step3Title', 'Step 3: Download')}</h4>
            <p className="text-gray-700">{t('step3Desc', 'Click on download to start the process and then get the file.')}</p>
          </div>
        </div>
      </section>

      {/* Intro/Features Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="rounded-lg  p-6">
          <h3 className="text-2xl text-gray-600 font-bold mb-4">{t('introFeatures', 'What You Can Do With This Site')}</h3>
          <p className="text-gray-500 mb-4">
            {t(
              'introDesc',
              'This website allows you to download YouTube videos in various formats, create clips, and even download thumbnails. It supports multiple platforms and provides a fast, scalable solution for video conversion.'
            )}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-500">
            <li>{t('feature1', 'Download full videos in multiple formats')}</li>
            <li>{t('feature2', 'Extract and download specific clips')}</li>
            <li>{t('feature3', 'Get high-quality thumbnails')}</li>
            <li>{t('feature4', 'User-friendly and responsive design')}</li>
          </ul>
        </div>
      </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-10">
            <div className="container mx-auto text-center">
              <p className="mb-4 font-bold text-3xl">Developed By</p>
              <div className="flex justify-center space-x-6">
                <a className="hover:bg-gray-700 transition" href="https://x.com/pratyek_" target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="h-10 w-10 m-3 text-blue-400 text-xl" />
                </a>
                <a className="hover:bg-gray-700 transition" href="https://github.com/pratyek" target="_blank" rel="noopener noreferrer">
                  <FaGithub className="h-10 w-10 m-3  text-gray-300 text-xl" />
                </a>
                <a className="hover:bg-gray-700 transition" href="https://www.linkedin.com/in/pratyek-thumula-2a62b4293/" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="h-10 w-10 m-3  text-blue-600 text-xl" />
                </a>
              </div>
            </div>
          </footer>

    </div>
  );
}
