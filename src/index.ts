import { MessageTypes } from 'whatsapp-web.js/src/util/Constants';
import { Message } from "whatsapp-web.js";
import * as qrcode from 'qrcode-terminal';
import { createWriteStream } from 'fs';
import { promisify } from 'util';
import * as path from 'path';
import { spawn } from 'child_process';
import * as fs from 'fs';
import { readFile } from 'fs/promises';

const {Client, MessageMedia} = require('whatsapp-web.js');
const { axios } = require('axios');
const Util = require('whatsapp-web.js/src/util/Util');
const Sticker = require('wa-sticker-formatter').StickerBuilder;
const mime = require('mime-types');

const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client ready');
});

client.on('message_create', (message: Message) => {
    if (message.body === 'hello') {
        message.reply('world');
    }

    const command: string = message.body.split(' ')[0];
    const sender: any = message.from.includes("85317726") ? message.to : message.from;
    if (command === ".sticker") {
        if (message.hasMedia) {
            // generateSticker(message, sender);
            generateSticker(message);
        } else {
            message.reply('send image or short video with caption *.sticker*');
        }
    }
});


client.initialize();

// const generateSticker = async (msg: Message, sender: string) => {
const generateSticker = async (msg: Message) => {

    try {
        msg.downloadMedia().then(media => {
            
            if (media) {
                const mediaPath = './downloaded-media/';

                if (!fs.existsSync(mediaPath)) {
                    fs.mkdirSync(mediaPath);
                }
                
                const extension = mime.extension(media.mimetype);
                const fileName = new Date().getTime();
                const fullFileName = mediaPath + fileName + '.' + extension;
                
                try {
                    fs.writeFileSync(fullFileName, media.data, { encoding: 'base64' });
                    console.log('File downloaded successfully!', fullFileName);
                    console.log(fullFileName);
                    MessageMedia.fromFilePath(fullFileName);
                    client.sendMessage(msg.from, new MessageMedia(media.mimetype, media.data, fileName), { sendMediaAsSticker: true });
                    fs.unlinkSync(fullFileName);
                    console.log(`File Deleted successfully!`, );
                } catch (err) {
                    console.log('Failed to save the file: ', err);
                    console.log(`File Deleted Successfully!`, );
                }
            }
        })
    } catch (e) {
        console.error(e);
        msg.reply("Error to process media to sticker");
    }
    
    // console.debug(msg.type);
    // if(msg.type === MessageTypes.IMAGE) {
    //     try {
    //         const { data } = await msg.downloadMedia();
    //         const image = await new MessageMedia("image/jpeg", data, "image.jpg");
    //         await client.sendMessage(sender, image, { sendMediaAsSticker: true });
    //     } catch(e) {
    //         msg.reply("❌ Erro ao processar imagem");
    //     }
    // } else if (msg.type === MessageTypes.VIDEO) {
    //     try {
    //         msg.downloadMedia().then(media => {
                
    //             if (media) {
    //                 const mediaPath = './downloaded-media/';

    //                 if (!fs.existsSync(mediaPath)) {
    //                     fs.mkdirSync(mediaPath);
    //                 }
                    
    //                 const extension = mime.extension(media.mimetype);
    //                 const fileName = new Date().getTime();
    //                 const fullFileName = mediaPath + fileName + '.' + extension;
                    
    //                 try {
    //                     fs.writeFileSync(fullFileName, media.data, { encoding: 'base64' });
    //                     console.log('File downloaded successfully!', fullFileName);
    //                     console.log(fullFileName);
    //                     MessageMedia.fromFilePath(fullFileName);
    //                     client.sendMessage(msg.from, new MessageMedia(media.mimetype, media.data, fileName), { sendMediaAsSticker: true });
    //                     fs.unlinkSync(fullFileName);
    //                     console.log(`File Deleted successfully!`, );
    //                 } catch (err) {
    //                     console.log('Failed to save the file: ', err);
    //                     console.log(`File Deleted Successfully!`, );
    //                 }
    //             }
    //         })
    //         // const { data } = await msg.downloadMedia();
    //         // const webpVideo = await Util.formatVideoToWebpSticker(data);
    //         // await client.sendMessage(sender, webpVideo, { sendMediaAsSticker: true });
    //     } catch (e) {
    //         console.error(e);
    //         msg.reply("❌ Erro ao processar video");
    //     }
    // } else {
    //     try {
    //         const url = msg.body.substring(msg.body.indexOf(" ")).trim();
    //         const { data } = await axios.get(url, {responseType: 'arraybuffer'});
    //         const returnedB64 = Buffer.from(data).toString('base64');
    //         const image = await new MessageMedia("image/jpeg", returnedB64, "image.jpg");
    //         await client.sendMessage(sender, image, { sendMediaAsSticker: true });
    //     } catch(e) {
    //         msg.reply("❌ Não foi possível gerar um sticker com esse link");
    //     }
    // }
}
  

//TODO verificar como salvar sessao
//Associar a um numero