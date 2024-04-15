import ytdl from 'ytdl-core';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import search from 'yt-search';

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('*مثــــــال*:\n\n *.play* فرشي التراب');
  try {
    const results = await search(text);
    const videoId = results.videos[0].videoId;
    const info = await ytdl.getInfo(videoId);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const url = info.videoDetails.video_url;
    const duration = parseInt(info.videoDetails.lengthSeconds);
    const uploadDate = new Date(info.videoDetails.publishDate).toLocaleDateString();
    const views = info.videoDetails.viewCount;
    const minutes = Math.floor(duration / 60);
    const description = results.videos[0].description;
    const seconds = duration % 60;
    const durationText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;       
    const audio = ytdl(videoId, { quality: 'highestaudio' });
    const inputFilePath = './tmp/' + title + '.webm';
    const outputFilePath = './tmp/' + title + '.mp3';
    const viewsFormatted = formatViews(views);

    audio.pipe(fs.createWriteStream(inputFilePath)).on('finish', async () => {
      ffmpeg(inputFilePath)
        .toFormat('mp3')
        .on('end', async () => {
          const buffer = fs.readFileSync(outputFilePath);                    
          conn.sendMessage(m.chat, {         
            audio: buffer,
            mimetype: 'audio/mpeg',
            contextInfo: {
              externalAdReply: {
                title: title,
                body: "",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: url,
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: true
              }
            }
          }, {
            quoted: m
          });
          fs.unlinkSync(inputFilePath);
          fs.unlinkSync(outputFilePath);
        })
        .on('error', (err) => {
          console.log(err);
          m.reply(`حدث خطأ أثناء تحويل الصوت: ${err.message}`);
          fs.unlinkSync(inputFilePath);
          fs.unlinkSync(outputFilePath);
        })
        .save(outputFilePath);
    });
  } catch (e) {
    console.log(e);
    m.reply(`حدث خطأ أثناء البحث عن الأغنية:`);
  }
};

handler.command = handler.help = ['play'];
handler.tags = ['downloader'];

export default handler;

function formatViews(views) {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  } else {
    return views.toString();
  }
}
