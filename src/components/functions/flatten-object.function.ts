// Nested objeyi düzleştirme fonksiyonu
export  const flattenObject = (obj: Record<string, any>, prefix = ''): Record<string, any> => {
    if (!obj || typeof obj !== 'object') return {};
  
    return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
      const propName = prefix ? `${prefix}.${key}` : key;
      
      if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        const nested = flattenObject(obj[key], propName);
        Object.assign(acc, nested);
      } else {
        acc[propName] = obj[key];
      }
      
      return acc;
    }, {});
  };