import Api from '../Api';
class GetService {
    getFile(id) {
        return Api.get(`/model/${id}`);
    }
}

export default new GetService();