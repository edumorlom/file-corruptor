import fileDownload from 'js-file-download';
import {useState} from 'preact/hooks';

export default function FileBinary(props: {
  file: File;
  status: string;
}): JSX.Element {
  const [fileDownloaded, setFileDownloaded] = useState<boolean>(false);
  const fileExtension = props.file?.name.split('.').pop() || '';

  const readFileContent = (file: File) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = event => resolve(event?.target?.result);
      reader.onerror = error => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  /**
   * Given the status and the file, corrupt and download the file.
   * Ensure that the status id "download" before proceeding.
   * Otherwise, the file is not ready for download.
   */
  const corruptAndDownloadFile = (status: string, file: File): void => {
    // Ensure that the file is ready for download.
    if (status !== 'download') return;

    // If it is, corrupt it and download it.
    setFileDownloaded(true);
    readFileContent(file).then(buffer => {
      const binary = new Int8Array(buffer as ArrayBuffer);
      const corruptedBinary = binary.map(elem => elem + 1);
      fileDownload(corruptedBinary, file.name);
    });
  };

  return (
    <div
      className={'file'}
      onClick={() => corruptAndDownloadFile(props.status, props.file)}
    >
      <FileIconSVG fileExtension={fileExtension} />
      <a>{props.file?.name}</a>
      {props.status === 'download' && (
        <DownloadSVG downloaded={fileDownloaded} />
      )}
    </div>
  );
}

/**
 * Given a string, it performs a hash function to return a color for that string.
 * The color will always be the same for the same string.
 * @param str the input string.
 * @returns the color in hexadecimal.
 */
const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
};

const FileIconSVG = (props: {fileExtension: string}): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      id="body_1"
      width="72"
      height="72"
    >
      <g transform="matrix(0.140625 0 0 0.140625 0 0)">
        <g transform="matrix(1 0 0 1 0 0)"></g>
        <path
          transform="matrix(1 0 0 1 0 0)"
          d="M128 0C 110.4 0 96 14.4 96 32L96 32L96 480C 96 497.616 110.4 512 128 512L128 512L448 512C 465.6 512 480 497.616 480 480L480 480L480 128L352 0L128 0z"
          stroke="none"
          fill="#E2E5E7"
          fill-rule="nonzero"
        />
        <g transform="matrix(1 0 0 1 0 0)"></g>
        <path
          transform="matrix(1 0 0 1 0 0)"
          d="M384 128L480 128L352 0L352 96C 352 113.6 366.4 128 384 128z"
          stroke="none"
          fill="#B0B7BD"
          fill-rule="nonzero"
        />
        <g transform="matrix(1 0 0 1 0 0)"></g>
        <path
          transform="matrix(1 0 0 1 0 0)"
          d="M480 224L384 128L480 128L480 224"
          stroke="none"
          fill="#CAD1D8"
          fill-rule="nonzero"
        />
        <g transform="matrix(1 0 0 1 0 0)"></g>
        <path
          transform="matrix(1 0 0 1 0 0)"
          d="M417 416C 417 424.8 409.8 432 401 432L401 432L49 432C 40.2 432 33 424.8 33 416L33 416L33 256C 33 247.2 40.2 240 49 240L49 240L401 240C 409.8 240 417 247.2 417 256L417 256L417 416z"
          stroke="none"
          fill={stringToColor(props.fileExtension)}
          fill-rule="nonzero"
        />
        <g transform="matrix(1 0 0 1 0 0)"></g>
        <path
          transform="matrix(1 0 0 1 0 0)"
          d="M400 432L96 432L96 448L400 448C 408.8 448 416 440.8 416 432L416 432L416 416C 416 424.8 408.8 432 400 432z"
          stroke="none"
          fill="#CAD1D8"
          fill-rule="nonzero"
        />
        <text
          transform="matrix(1 0 0 1 0 0)"
          x="63.5"
          y="371"
          style="fill:#FFFFFF;font-family:'Montserrat',sans-serif;"
          font-size="96"
        >
          {props.fileExtension.toUpperCase()}
        </text>
      </g>
    </svg>
  );
};

function DownloadSVG(props: {downloaded: boolean}): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 100 100"
      id="Layer_1"
      version="1.1"
      width="40"
      className="download-button"
    >
      <g>
        <path
          d="M9.843 52.312L50 92.469l40.157-40.157-8.032-8.031-26.446 26.446V7.469H44.321v63.258L17.875 44.281z"
          className={props.downloaded ? 'download-btn-clicked' : 'download-btn'}
        ></path>
      </g>
    </svg>
  );
}
