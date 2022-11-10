import fieldLookupTable from './fieldLookupTable';

export default function getRequestParameters(filters) {
  return Array.from(Object.entries(filters))
    .reduce((accumulator, filter) => {
      const [field, values] = filter;

      if (['max_age', 'start_time', 'end_time'].includes(field)) { return values ? [...accumulator, `${field}=${values}`] : accumulator; }

      if (field === 'open_registration') { return values.open_registration ? [...accumulator, `${field}=${true}`] : accumulator; }

      const valuesArray = Array.from(Object.entries(values));
      const isMultiParam = valuesArray.filter(([, value]) => value === true).length > 1;
      return [
        ...accumulator,
        valuesArray.reduce((_accumulator, value) => {
          const [name, isActive] = value;
          return isActive ? [..._accumulator, `${isMultiParam ? fieldLookupTable[field] : field}=${name}`] : [..._accumulator];
        }, []),
      ].flat();
    }, [])
    .join('&');
}
