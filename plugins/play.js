import yts from 'yt-search'
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper-sosmed'

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw ` مثال :\n.song سورة الرحمن بصوت القارئ حمزة بوديب`

  let res = await yts(text)
  let vid = res.videos[0]

  await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  if (!vid) throw 'لم يتم العثور عليه، حاول عكس العنوان والمؤلف'

  let { title, videoId, durationH, viewH, publishedTime } = vid
  const url = 'https://www.youtube.com/watch?v=' + videoId

  let doc = {
    audio: {
      url: await (await youtubedl(url).catch(async () => await youtubedlv2(url))).audio['128kbps'].download()
    },
    mimetype: 'audio/mp4',
    fileName: `${title}`,
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        mediaType: 2,
        mediaUrl: url,
        title: title,
        body: "© FOX MD BOT",
        sourceUrl: 'https://wa.me/message/KGDUYWPLPTGIN1'
      }
    }
  }

  return conn.sendMessage(m.chat, doc, { quoted: m })
}

handler.help = ['play']
handler.command = /^play$/i

export default handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
