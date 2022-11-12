interface IPlaceFinder {
  search(searchQuery: string, languageId: string, country: any): Promise<any>;
  transform(results: any[]): any[];
}

export default IPlaceFinder;
