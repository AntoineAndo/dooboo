interface IPlaceFinder {
  search(searchQuery: string, language: string, country: string): Promise<any>;
  transform(results: any[]): any[];
}

export default IPlaceFinder;
