import Api from '../http-common';
class UploadService {
    upload(id, file) {
        return Api.post('/upload', id, file);
    }
}

export default new UploadService();