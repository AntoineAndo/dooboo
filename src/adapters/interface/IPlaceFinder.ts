interface IPlaceFinder {
  search(searchQuery: string, language: string, country: string): Promise<any>;
}

export default IPlaceFinder;
