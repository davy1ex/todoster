import { FC } from 'react';

interface GoogleSheetViewProps {
  sheetUrl: string;
  width?: string | number;
  height?: string | number;
}

export const GoogleSheetView: FC<GoogleSheetViewProps> = ({
  sheetUrl,
  width = '100%',
  height = '600px',
}) => {
  // Convert the sheet URL to an embed URL
  const embedUrl = sheetUrl.replace(/\/edit.*$/, '/preview');

  return (
    <div style={{ width, height }}>
      <iframe
        src={embedUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '8px',
        }}
        title="Google Sheet"
      />
    </div>
  );
}; 