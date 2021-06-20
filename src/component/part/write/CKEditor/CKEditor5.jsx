import React, { useEffect, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const comments_config = ['bold','italic','link','undo','redo'];
const basic_config = [
  'heading','|','bold','italic','link','bulletedList','numberedList','|',
  'blockQuote','insertTable','|','imageUpload','undo','redo', 'imageStyle:full',
  'imageStyle:side',
  '|',
  'imageTextAlternative'];
function CKEditor5({onlyComments, onChange, data, useKeyword}){
  
  const custom_config = {
    extraPlugins: [ MyCustomUploadAdapterPlugin ],
    toolbar: {
      items: onlyComments ? comments_config :basic_config
    },
    table: {
      contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
    }
  }

  const [keyword,setKeyword] = useState([]);
  const ref = useRef(0); 

  return (
      <div className="CKEditor_custom">
        <CKEditor
          required
          editor={ClassicEditor}
          config={custom_config}
          data={data}
          onChange={(event, editor) => {
            const data = editor.getData();
            onChange(data,keyword);
          }}  
          onReady ={(editor) => {
            if(editor){
              editor.editing.view.change((writer) => {         
                writer.setStyle("height", onlyComments ? "100px" : "500px", editor.editing.view.document.getRoot());
              });
            }
           
        }}       
      />
      {/* ref.current.focus() */}
      <div className="keyword" id="keyword_tag">
        {
          keyword.map((k,i)=>{
            return (
              <p className="tag" key={k+i}>
                <span onClick={()=>{
                  setKeyword(keyword.filter(v=> v !== k));
                }}>x</span>
                #{k}
              </p>
            )
          })
        }
        <div className="keyword_wrap">
          <span className="span_tag">#</span>
          <input type="text" placeholder="태그 입력 (최대 10개)"
          ref={(r)=>{ref.current = r}} maxLength="10" minLength="1" onKeyUp={(e)=>{  
            const msg = document.getElementById("keyword_ckeditor_msg");
            var blank_pattern = /^\s+|\s+$/g;
            if(keyword.length >= 10){
              msg.innerText = "태그는 최대 10개까지 가능합니다.";
              msg.classList.add("error");
              msg.classList.remove("success");
              e.target.value = "";
              return;
            }
            if(e.target.value.replace(blank_pattern,'') === ""){
              msg.innerText = "공백은 입력할 수 없습니다.";
              msg.classList.add("error");
              msg.classList.remove("success");
              e.target.value = "";
              return;
            }
            if((e.code === "Enter" || e.code === "Space")){
              const value =  e.target.value.replace(/(\s*)/g, "");
              for(let i = 0 ; i < keyword.length ; i++){
                if(keyword[i] === value){
                  msg.innerText = "이미 입력된 태그입니다.";
                  msg.classList.add("error");
                  msg.classList.remove("success");
                  e.target.value = "";
                  return;
                }
              }        
              setKeyword([...keyword, value]);
              ref.current.focus();
              e.target.value = "";
            }    
          }}/>
        </div>
      </div>
      
      <div id="keyword_ckeditor_msg" style={{textAlign:"left"}}></div>
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