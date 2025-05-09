import axios from "axios";
import { IGetSignedUrlData } from "types/Order";

function dataURLtoFile(dataUrl: string, filename: string) {

    let arr = dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/)?.[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}

function uploadFileToS3(data: IGetSignedUrlData, file: any) {
    const formData = new FormData();
    for (let key in data.fields) {
        formData.append(key, (data.fields as any)[key]);
    }
    formData.append('file', file);

    return axios({
        method: 'post',
        url: data.url,
        data: formData,
    });
};

export {
    uploadFileToS3,
    dataURLtoFile
}