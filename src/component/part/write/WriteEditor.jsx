import {Editor} from "react-draft-wysiwyg";
import { EditorState,convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { useCallback, useEffect, useState } from "react";

export default function WriteEditor(props){

    const {onChange, isComment, editorState : es , onEditorStateChange : onesc}= props;

   
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [test, setTest] = useState("");
    const uploadCallback = useCallback((file)=>{
        return new Promise(
            (resolve, reject)=>{
                if(file.size <= 2097152){
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    let img = new Image();
                    reader.onload = function (e) {
                        img.src = this.result
                        resolve({
                            data: {
                            link: img.src
                            }
                        })
                    } 
                }else{
                   alert("이미지 크기가 2MB보다 큽니다.");
                   resolve(null);
                }
            }
        );
    },[])
    const onEditorStateChange = (es)=>{ 
        setEditorState(es);  
    }
    const options = ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'];
    useEffect(()=>{
        const editorToHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        
        if(onChange) onChange(editorToHtml);
        
    },[editorState,test])

    
    return(
        <Editor
        localization={{
            locale: 'ko',
        }}
        editorClassName={isComment ? "editor_comment" : "editor_save"}
        editorState = {es ? es : editorState}    
        wrapperClassName="editor_main_wrapper"
        toolbar ={{
            options : isComment ? ["inline",'emoji'] : options,
            image : {          
                urlEnabled: true,
                uploadEnabled: true,
                alignmentEnabled: true,
                previewImage: true,
                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',                  
                alt: { present: false, mandatory: false },
                defaultSize: {
                    height: 'auto',
                    width: 'auto',
                },   
                uploadCallback: uploadCallback,
               
            }

        }}   
        toolbarHidden={false}
        onEditorStateChange={onesc ? onesc : onEditorStateChange}   
        onChange={(e)=>{
            console.log(e)
        }}
        />
        
    )
        
}

