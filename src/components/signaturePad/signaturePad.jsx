import React, {useCallback, useEffect, useImperativeHandle, useRef} from "react";
import Taro from '@tarojs/taro';
import {Canvas} from "@tarojs/components";
import SignaturePadOrign from './utils/signature_pad.js'
import './signaturePad.less';

const SignaturePad = React.forwardRef(({className, style}, ref)=>{
    console.log('hello world!')
    const canvasRef = useRef();
    const signaturePadRef = useRef(new SignaturePadOrign());

    const handleTouchStart = useCallback((e)=>{
        signaturePadRef.current && signaturePadRef.current.handleTouchStart(e);
    },[]);

    const handleTouchMove = useCallback((e)=>{
        signaturePadRef.current && signaturePadRef.current.handleTouchMove(e);
    },[]);

    const handleTouchEnd = useCallback((e)=>{
        signaturePadRef.current && signaturePadRef.current.handleTouchEnd(e);
    },[]);

    const handleSaveCanvas = useCallback(() =>{
        if(!canvasRef.current) {
            return;
        }
        //@ts-ignore
        Taro.canvasToTempFilePath({
            canvas: canvasRef.current,
        }).then(res => {
            Taro.saveImageToPhotosAlbum({
                filePath: `${res.tempFilePath}`,
                success() {
                    Taro.showToast({
                        title: '保存成功'
                    });
                },
                fail() {
                    Taro.showToast({
                        title: '保存失败'
                    });
                }
            })
        }).catch(e => {
          console.log(e);
        });
    },[]);


    const handleClearCanvas = useCallback(()=>{
        signaturePadRef.current.clear();
    }, []);

    const toDataURL = useCallback((type, encoderOptions)=>{
        return signaturePadRef.current.toDataURL(type, encoderOptions);
    }, []);

    const isEmpty = useCallback(()=>{
        return signaturePadRef.current.isEmpty();
    }, []);

    const fromDataURL = useCallback((dataUrl, options = {}, callback)=>{
        signaturePadRef.current.fromDataURL(dataUrl, options, callback);;
    }, []);

    useImperativeHandle(ref, ()=>({
        save: handleSaveCanvas,
        clear: handleClearCanvas,
        toDataURL: toDataURL,
        isEmpty: isEmpty,
        fromDataURL: fromDataURL,
    }));

    useEffect(()=>{
        Taro.nextTick(()=>{
            //需要设置为type=2d才会不报错
            const query = Taro.createSelectorQuery().in(Taro.getCurrentInstance().page);
            query.select('.sp-canvas')
                .fields({ node: true, size: true })
                .exec((res) => {
                    const canvas = res[0].node
                    const ctx = canvas.getContext('2d')

                    const dpr = Taro.getSystemInfoSync().pixelRatio
                    canvas.width = res[0].width * dpr
                    canvas.height = res[0].height * dpr
                    ctx.scale(dpr, dpr)

                    signaturePadRef.current.init(canvas);
                    canvasRef.current = canvas;
                })
        });
    }, []);

    return (
        <Canvas
          className={"sp-canvas "+className}
          style={style}
          id='sp-canvas'
          canvasId='sp-canvas'
          type='2d'
          disableScroll
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
    );
});


export default React.memo(SignaturePad);
