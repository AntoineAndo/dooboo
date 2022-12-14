interface IPlaceFinder {
  search(options: {
    searchQuery: string;
    languageId: string;
    countryCode: any;
    location?: {
      lat: string;
      lng: string;
    };
  }): Promise<any>;
  transform(results: any[]): any[];
}

export default IPlaceFinder;
