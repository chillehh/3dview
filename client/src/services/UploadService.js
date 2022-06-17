import Api from '../UploadApi';
class UploadService {
    upload(file) {
        let formData = new FormData();
        formData.append('file', file);
        return Api.post(`/upload`, formData);
    }
}

export default new UploadService();