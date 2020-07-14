export class VASTStaticResource {
    private creativeTypeInternal: string;
  
    get creativeType(): string {
      return this.creativeTypeInternal;
    }
  
    private uriInternal: URL;
  
    get uri(): URL {
      return this.uriInternal;
    }
  
    constructor(rootElement: Element) {
      this.creativeTypeInternal = this.parseCreativeType(rootElement);
  
      if (rootElement.textContent === null) {
        throw new Error('StaticResource element must have URI.');
      } else {
        this.uriInternal = new URL(rootElement.textContent);
      }
    }
  
    private parseCreativeType(rootElement: Element): string {
      console.info('Parse StaticResource@creativeType');
  
      for (let i = 0; i < rootElement.attributes.length; i++) {
        if (rootElement.attributes[i].name === 'creativeType') {
          return rootElement.attributes[i].value;
        }
      }
  
      throw new Error(
          'StaticResource@creativeType required attribute is missing.');
    }
  }