import { useGeocoding } from '@features/map/hooks/useGeocoding';

const AddressSearch = () => {
  const { query, results, isLoading, handleSearch, handleSelect } =
    useGeocoding();

  return (
    <div style={{ position: 'relative', marginBottom: '12px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Busca la dirección donde perdiste a tu perro..."
        style={{
          width: '100%',
          padding: '10px 14px',
          fontSize: '14px',
          borderRadius: '8px',
          border: '2px solid #ccc',
          boxSizing: 'border-box',
        }}
      />

      {isLoading && (
        <p style={{ fontSize: '12px', color: '#999' }}>Buscando...</p>
      )}

      {results.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            color: '#000000',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            listStyle: 'none',
            margin: 0,
            padding: '4px 0',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => handleSelect(r)}
              style={{
                padding: '10px 14px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.background = '#f5f5f5')
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.background = 'white')
              }
            >
              {r.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressSearch;
