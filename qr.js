const PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: Maher_Zubair,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("maher-zubair-baileys");

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function SIGMA_MD_PAIR_CODE() {
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState('./temp/' + id);

        try {
            let Pair_Code_By_Maher_Zubair = Maher_Zubair({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: ["Chrome (Linux)", "", ""]
            });

            if (!Pair_Code_By_Maher_Zubair.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Pair_Code_By_Maher_Zubair.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_Maher_Zubair.ev.on('creds.update', saveCreds);
            Pair_Code_By_Maher_Zubair.ev.on("connection.update", async (s) => {
                const {
                    connection,
                    lastDisconnect
                } = s;

                if (connection == "open") {
                    await delay(5000);

                    // Read the contents of `creds.json` and send as a text message
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`, 'utf-8');
                    let session = await Pair_Code_By_Maher_Zubair.sendMessage(
                        Pair_Code_By_Maher_Zubair.user.id,
                        { text: `Here is your session data:\n\n${data}` } // Send file content as text
                    );

                    let SIGMA_MD_TEXT = `
          _*PAIR Successful 🌟*_
Put the above ID in the sessID variable when deploying.
Use this Session ID for all bots by STAR KING.
╔═════◇
║       『••• STAR KING•••』
║ *Channel:* _https://whatsapp.com/channel/0029VamU5H1DuMRYiHQ9vI09_
║ *Main GC:* _https://chat.whatsapp.com/DC38hUUVVaa1vp573QBYBF_
║ *Github:* _https://github.com/STAR-KING0_
║ *Owner:* _https://wa.me/2348100835767_
║ *Note :*_ Do not provide your SESSION_ID to
║ _anyone otherwise that can access your WA messages_
║ _*Follow Me and Star my repo for more 🫡.*_
╚════════════════════════╝`;

                    await Pair_Code_By_Maher_Zubair.sendMessage(
                        Pair_Code_By_Maher_Zubair.user.id,
                        { text: SIGMA_MD_TEXT },
                        { quoted: session }
                    );

                    await delay(100);
                    await Pair_Code_By_Maher_Zubair.ws.close();
                    return await removeFile('./temp/' + id);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    SIGMA_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restarted");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "Service Unavailable" });
            }
        }
    }

    return await SIGMA_MD_PAIR_CODE();
});

module.exports = router;
