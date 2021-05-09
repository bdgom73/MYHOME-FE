
export default function VideoDetail(props){

    const iframe = document.getElementsByTagName("iframe");
    // iframe[0].setAttribute("allowfullscreen",true);
    console.log(iframe);
    return(
        <>
        <div className="board_detail_wrap">
            <div className="board_body">
                <div className="board_video">
                    <video controls>
                        <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                    </video>
                    <iframe width="500" height="280" 
                    title="Youtube video"
                    src="https://www.youtube.com/embed/dFk43kPfVAo"  
                    allowfullscreen="allowfullscreen"
                    mozallowfullscreen="mozallowfullscreen" 
                    msallowfullscreen="msallowfullscreen" 
                    oallowfullscreen="oallowfullscreen" 
                    webkitallowfullscreen="webkitallowfullscreen"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                   ></iframe>
                </div>
                <div className="board_sub">

                </div>
            </div>
        </div>
        </> 
    );
}