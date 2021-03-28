import {useState} from 'preact/hooks';
import FileBinary from './FileBinary';
import ShrederSVG from './ShrederSVG';

export function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string>('initial');

  const drop = (event: any) => {
    event.preventDefault();
    const fileAsDataTransfer = Object.values(
      event.dataTransfer.items
    ) as DataTransferItem[];

    if (fileAsDataTransfer) {
      const fileObjs: File[] = fileAsDataTransfer.map(
        file => file.getAsFile() as File
      );

      setFiles(fileObjs);
      setStatus('ready');
    }
  };

  const drag = (event: any) => {
    event.preventDefault();
  };

  const corrupt = () => {
    setStatus('corrupt');
    setTimeout(() => {
      setStatus('download');
    }, 3000);
  };

  return (
    <>
      <div className="title">
        <h1>Online File Corruptor</h1>
        <h5>Corrupt it, send it, and blame it on their computer</h5>
      </div>
      <div id="drop-zone" onDrop={drop} onDragOver={drag}>
        <DropZone status={status} files={files} />
      </div>

      {status === 'ready' && (
        <button class={'corrupt-btn'} onClick={corrupt}>
          Corrupt All Uploaded Files
        </button>
      )}
    </>
  );
}

const DropZone = (props: {status: string; files: File[]}) => {
  if (props.status === 'corrupt') return <ShrederSVG />;
  if (['ready', 'download'].includes(props.status)) {
    return (
      <>
        {props.files.map(file => (
          <FileBinary file={file} status={props.status} />
        ))}
      </>
    );
  }
  return <h3>Drag and drop multiple files</h3>;
};
