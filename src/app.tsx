import {useState} from 'preact/hooks';
import FileBinary from './FileBinary';
import ShrederSVG from './ShrederSVG';

export function App() {
  // The list of files to corrupt.
  const [files, setFiles] = useState<File[]>([]);
  // The state of the corruption process. initial, ready, corrupt, download.
  const [status, setStatus] = useState<string>('initial');

  const drop = (event: any) => {
    event.preventDefault();

    // Get the DataTransferItem that has been dropped.
    const fileAsDataTransfer = Object.values(
      event.dataTransfer.items
    ) as DataTransferItem[];

    // If there are any files, convert the DataTransferItem to a File.
    if (fileAsDataTransfer) {
      const fileObjs: File[] = fileAsDataTransfer.map(
        file => file.getAsFile() as File
      );

      // Store the files in the state.
      setFiles(fileObjs);

      // Files are ready for corruption, set state.
      setStatus('ready');
    }
  };

  /**
   * Changes the state to "corrupt", and after 3 seconds, it changes it to download.
   * The reason for this is, while corrupt process is happening, there is an animation
   * that takes place, and takes around 3 seconds to complete.
   */
  const corruptFiles = () => {
    setStatus('corrupt');

    setTimeout(() => {
      setStatus('download');
    }, 3000);
  };

  return (
    <>
      <div className="title">
        <h1>Online File Corruptor</h1>
        <h5>Corrupt it, send it, and blame it on their machine</h5>
      </div>
      <div
        id="drop-zone"
        onDrop={drop}
        onDragOver={event => {
          event.preventDefault();
        }}
      >
        <DropZone status={status} files={files} />
      </div>

      {status === 'initial' && (
        <h5 className="title">
          Don't worry, the original files won't be modified!
        </h5>
      )}

      {status === 'ready' && (
        <button class={'corrupt-btn'} onClick={corruptFiles}>
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
