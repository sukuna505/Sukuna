let handler = async (m, { conn, isBotAdmin }) => {
  try {
    const mtype = m.quoted.mtype;
    const settings = {
      'audioMessage': { viewOnce: true },
      'videoMessage': { viewOnce: true },
      'imageMessage': { viewOnce: true },
      'stickerMessage': { isAvatar: true },
      'documentMessage': { viewOnce: true }
    };

    if (settings[mtype]) {
      let doc = m.quoted.mediaMessage;
      Object.assign(doc[mtype], settings[mtype]);
      await conn.relayMessage(m.chat, doc, { quoted: m });
      
      const hapus = m.quoted.sender ? m.message.extendedTextMessage.contextInfo.participant : m.key.participant;
      const bang = m.quoted.id ? m.message.extendedTextMessage.contextInfo.stanzaId : m.key.id;

      if (isBotAdmin) {
        return conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: hapus }});
      } else {
        return conn.sendMessage(m.chat, { delete: m.quoted.vM.key });
      }
    } else {
      throw "قم بالاشارة لصورة او اوديو او فيديو او ملصق او اي وسائط ثم اكتب \n*.1time*\nوسوف يعيد البوت ارسال الملف الذي ارسلته ليظهر لك مرة واحدة فقط\nview once messages 😉";
    }
  } catch {
    throw 'هنالك خطأ راسل صاحب البوت \ninstagram.com/noureddine_ouafy';
  }
};

handler.help = ['1time'];
handler.tags = ['owner'];
handler.command = /^(1time)$/i;
handler.owner = true
export default handler
