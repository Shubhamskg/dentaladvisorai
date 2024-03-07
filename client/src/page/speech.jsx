import React, { useCallback, useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import SpeechStop from "../assets/speechStop";
import {VoiceRecognitionButton} from "../assets"
import { useDispatch, useSelector } from "react-redux";
import { addList, emptyAllRes, insertNew, livePrompt } from "../redux/messages";

export default function Speech({textarea,cls,q,q2,q3,q4,set,fn}) {
    const dispatch = useDispatch();
    const [speechActive,setSpeechActive]=useState(false)
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();
      const startListening = () => SpeechRecognition.startListening({ continuous: true });
      const stopListening=useCallback(()=>{
        SpeechRecognition.stopListening()
        setSpeechActive(false)
        fn()
        if(!speechActive)
        resetTranscript()
      })
    const speechToText=()=>{
        resetTranscript()
        setSpeechActive(true)
        startListening()
        
    }
          useEffect(()=>{
            console.log(transcript)
            if(q=="q2" && speechActive){
                q2.current.value=transcript
                set(transcript)
            }else if(q=="q3" && speechActive){
                set(transcript)
                q3.current.value=transcript
            }else if(q=="q4" && speechActive){
                set(transcript)
                q4.current.value=transcript
            }else if(q=="text" && speechActive){
                textarea.current.value=transcript
                set(transcript)
            }
            
          },[transcript])
  return (
    <>
        {browserSupportsSpeechRecognition && !listening  && !speechActive && <VoiceRecognitionButton className={`recorderq`} onClick={speechToText} />}
        {browserSupportsSpeechRecognition && listening && speechActive && <SpeechStop className={`recorderq red`} onClick={stopListening}/>}
    </>
  )
}
