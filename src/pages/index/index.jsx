import { Component } from "react";
import { View } from "@tarojs/components";
import SignaturePad from "../../components/signaturePad/signaturePad"
import "./index.less";

export default class Index extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className='signature'>
        {/* <Signature className='signature-canvas' ref={signatureRef} /> */}
        <SignaturePad></SignaturePad>
      </View>
    );
  }
}
