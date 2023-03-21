import { Request, Response } from 'express';
import axios from 'axios';


export class TranslationController {
    static async translateText(req: Request, res: Response): Promise<any> {
        // DEFINE ENCODED HTTP REQUEST PARAMETERS
        const encodedParams = new URLSearchParams();
        encodedParams.append("q", req.body.inputText);
        encodedParams.append("target", req.body.targLang); // your global var
        encodedParams.append("source", req.body.srcLang); // message.lang

        // CONFIGURE REQUEST OPTIONS
        const options = {
            method: 'POST',
            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': 'ecf66d69d6mshe72310107b57165p10bd22jsn5245b15bf146',
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
            },
            data: encodedParams
        };

        // SEND HTTP REQUEST AND RETURN RESPONSE
        axios
          .request(options)
          .then((response: any) => {
              res.json(response.data.data.translations[0].translatedText);
          })
          .catch((error: any) => {
              console.error(error);
          });
    }
}

export default TranslationController;
