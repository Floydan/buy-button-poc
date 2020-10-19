class AffiliationService {
    static data = {
        affiliateId: '',
        version: ''
    }

    static setData(affiliateId, version) {
        this.data.affiliateId = affiliateId || '';
        this.data.version = version || '';

        return this.data;
    }

    static getData() {
        return this.data;
    }
}

export default AffiliationService;