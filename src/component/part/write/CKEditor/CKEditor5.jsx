import React, { useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const comments_config = ['bold','italic','link','undo','redo'];
const basic_config = [
  'heading','|','bold','italic','link','bulletedList','numberedList','|',
  'blockQuote','insertTable','|','imageUpload','undo','redo', 'imageStyle:full',
  'imageStyle:side',
  '|',
  'imageTextAlternative'];
function CKEditor5({onlyComments, onChange, data}){
  
  const custom_config = {
    extraPlugins: [ MyCustomUploadAdapterPlugin ],
    toolbar: {
      items: onlyComments ? comments_config :basic_config
    },
    table: {
      contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
    }
  }

  

      
  return (
      <div className="CKEditor_custom">
        <CKEditor
          required
          editor={ClassicEditor}
          config={custom_config}
          data={data}
          onChange={(event, editor) => {
            const data = editor.getData();
            onChange(data)
          }}  
          onReady ={(editor) => {
            if(editor){
              editor.editing.view.change((writer) => {         
                writer.setStyle("height", onlyComments ? "100px" : "500px", editor.editing.view.document.getRoot());
              });
            }
           
        }}       
      />
          
      </div>
  );
    
}

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = (loader) => {     
      return new MyUploadAdapter(loader)
    }
  }
  
class MyUploadAdapter {
  constructor(props) {
      // CKEditor 5's FileLoader instance.
    this.loader = props;
    // URL where to send files.
    this.url = `/bbs/ckeditor/upload`;
  }

  // Starts the upload process.
  upload() {
      return new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject);
          this._sendRequest();
      } );
  }

  // Aborts the upload process.
  abort() {
      if ( this.xhr ) {
          this.xhr.abort();
      }
  }

  // Example implementation using XMLHttpRequest.
  _initRequest() {
      const xhr = this.xhr = new XMLHttpRequest();

      xhr.open('POST', this.url, true);
      xhr.responseType = 'json';
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
      xhr.setRequestHeader('Authorization',"admin")
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners( resolve, reject ) {
      const xhr = this.xhr;
      const loader = this.loader;
      const genericErrorText = 'Couldn\'t upload file:' + ` ${ loader.file.name }.`;
      
      xhr.addEventListener( 'error', () => reject( genericErrorText ) );
      xhr.addEventListener( 'abort', () => reject() );
      xhr.addEventListener( 'load', () => {
          const response = xhr.response;
          if ( !response || response.error ) {
              return reject( response && response.error ? response.error.message : genericErrorText );
          }
          // If the upload is successful, resolve the upload promise with an object containing
          // at least the "default" URL, pointing to the image on the server.
          resolve({
              default: response.url
          });
      } );

      if ( xhr.upload ) {
          xhr.upload.addEventListener( 'progress', evt => {
              if ( evt.lengthComputable ) {
                  loader.uploadTotal = evt.total;
                  loader.uploaded = evt.loaded;
              }
          } );
      }
  }

  // Prepares the data and sends the request.
  _sendRequest() {
      const data = new FormData();

      this.loader.file.then(result => {
        data.append('file', result);
        this.xhr.send(data);
        }
      )
  }

}
  
export default CKEditor5;