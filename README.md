# YouTube Downloader

A scalable Next.js YouTube Downloader with multilingual support, built using BullMQ, Redis, MongoDB, and react-i18next. This project allows users to download full YouTube videos, extract clips, and download thumbnails in various formats. It also supports multiple languages including English, Spanish, Hindi, Telugu, Tamil, Bengali, Marathi, French, and Chinese.

## Features

- **Multiple Formats:** Download videos in formats like MP4, MP3, MOV, MKV, WEBM, and FLV.
- **Clip Extraction:** Specify start and end times to download specific clips from videos.
- **Thumbnail Download:** Download high-quality thumbnails from YouTube videos.
- **Multilingual Support:** User interface available in nine languages.
- **Scalable Architecture:** Uses BullMQ (with Redis) for job queuing and real-time progress tracking.
- **Persistent Storage:** Uses MongoDB to store download metadata and progress.
- **Modern UI:** Built with Next.js and styled using Tailwind CSS, inspired by [ssyoutube.com](https://ssyoutube.com/en789Jb/).

## Prerequisites

- **Node.js** (v14 or above is recommended)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Redis** (local or cloud instance)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd mp3-downloader
   ```

2.**Install Dependencies:**

```bash
npm install
```
or
```bash
yarn install
```

## Configuration
 - Create a .env.local file in the root of your project and add the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/youtube-downloader
REDIS_URL=redis://localhost:6379
```
Adjust the URIs as needed for your environment.

## **Running the Application**
1. Start the Next.js Server
Start the development server with:

```bash
npm run dev
```
or

```bash
yarn dev
```
Access the application at http://localhost:3000.

2. Start the Worker Process
In a separate terminal window, start the BullMQ worker:

```bash
node workers/downloadWorker.js
```
The worker listens for download jobs from the queue and handles processing with yt-dlp.

## **Project Structure**
 - app/
   - Contains your Next.js pages, API routes (download, thumbnail, etc.), and components.

 - workers/
   - Contains the BullMQ worker (downloadWorker.js) that processes download jobs.

 - lib/queue.js
   - Initializes the BullMQ queue using Redis.

 - i18n.js
   - Configures react-i18next with translations for multiple languages.

- styles/
  - Contains global CSS and Tailwind CSS configuration files.

## **How to Use**
1.**Select Language:**
 - Use the language dropdown in the header to switch between supported languages.

2.**Download Video:**
 - Enter the YouTube URL in the provided field.
 - Select the desired video format.
 - Optionally, choose to download a specific clip by providing start and end times.
 - Click the "Download" button to enqueue the download job.

3.**Monitor Progress:**
 - Watch the progress bar update in real time. Once the download is complete, you’ll see options to download the video file or its thumbnail.

4.**Reset/Start New Download:**
 - Click "Cancel" to reset the current download state and start over.

## Customization
### Styling:
 - The project uses Tailwind CSS for styling. Customize the classes or add your own styles as needed.

### Translations:
 - Update or extend the translations in i18n.js to adjust language support or add new languages.

## Contributing
 - Contributions are welcome! Feel free to open issues or submit pull requests for enhancements or bug fixes.







