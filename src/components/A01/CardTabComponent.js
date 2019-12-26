import React, { useState } from "react";
import { View, TouchableOpacity, Text, Image, Platform } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "../FormInput";
import styles from "./styles/CardTabComponentStyles";
import ImagePicker from "react-native-image-picker";
import * as api from "../../logic/api";
import { connect } from "react-redux";
import * as actions from "../../logic/actions";
import * as constants from "../../logic/constants";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const options = {
  title: "Select Avatar",
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};

const CardTabComponent = props => {
  const [identityCardImage, setIdentityImage] = useState(null);
  const [memberCardImage, setMemberImage] = useState(null);
  const [identityNumber, setIdentityNumber] = useState("");
  const [memberNumber, setMemberNumber] = useState("");

  const uploadImage = image => {
    const data = new FormData();
    data.append("file", {
      name: image.fileName,
      type: image.type,
      uri:
        Platform.OS === "android" ? image.uri : image.uri.replace("file://", "")
    });
    return new Promise((resolve, reject) => {
      api
        .uploadCardImage(data)
        .then(response => {
          resolve(response.id);
        })
        .catch(e => {
          console.log("error upload image: ", e);
          reject(e);
        });
    });
  };

  const pickImage = imageType => {
    props.showModal({ open: true }, "loading");
    ImagePicker.showImagePicker(options, async response => {
      try {
        console.log("Response = ", response);
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else if (response.customButton) {
          console.log("User tapped custom button: ", response.customButton);
        } else {
          if (imageType == "identityCardImage") {
            const identityId = await uploadImage(response);
            setIdentityNumber(identityId);
            setIdentityImage(response);
          } else if (imageType == "memberCardImage") {
            const memberId = await uploadImage(response);
            setMemberNumber(memberId);
            setMemberImage(response);
          }
          props.showModal({ open: false }, "loading");
        }
      } catch (e) {
        __DEV__ && console.log("Pick image error: ", e);
        props.showModal(
          {
            open: true,
            message: e.message || constants.SOME_ERROR_HAPPEN,
            closeModal: props.hideModal
          },
          "alert"
        );
      }
    });
  };

  const handleSubmit = async values => {
    const { email } = values;
    if (props.connecting) {
      try {
        const identifyCode = await identityNumber;
        const memberCode = await memberNumber;
        if (identifyCode == "") {
          props.showModal(
            {
              open: true,
              message: "Bạn chưa chọn ảnh Chứng minh nhân dân!",
              closeModal: props.hideModal
            },
            "alert"
          );
        } else if (memberCode == "") {
          props.showModal(
            {
              open: true,
              message: "Bạn chưa chọn ảnh Thẻ hội viên!",
              closeModal: props.hideModal
            },
            "alert"
          );
        } else {
          await api.signUpWithCards(email, identifyCode, memberCode);
          props.showModal(
            {
              open: true,
              message: constants.SIGN_UP_SUCCESS_CONTENT,
              title: constants.SIGN_UP_SUCCESS_TITLE,
              closeModal: props.hideModal
            },
            "alert"
          );
        }
      } catch (e) {
        __DEV__ && console.log("Sign up error: ", e);
        props.showModal(
          {
            open: true,
            message: e.errorMessage || constants.SOME_ERROR_HAPPEN,
            closeModal: props.hideModal
          },
          "alert"
        );
      }
    } else {
      props.showModal(
        {
          open: true,
          message: constants.CONNECTION_FAIL,
          closeModal: props.hideModal
        },
        "alert"
      );
    }
  };

  return (
    <Formik
      validateOnChange={false}
      initialValues={{ email: "" }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Địa chỉ Email không hợp lệ")
          .required("Vui lòng nhập địa chỉ Email")
      })}
      render={({ values, handleSubmit, errors, setFieldValue }) => {
        return (
          <React.Fragment>
            <FormInput
              value={values.email}
              autoFocus={true}
              label={"Địa chỉ E-Mail"}
              containStyle={{ width: "100%" }}
              onChangeText={value => setFieldValue("email", value.trim())}
              autoCapitalize={"none"}
              error={errors.email || " "}
            />
            <View style={styles.imgPickWrap}>
              <Text style={styles.label}>Ảnh Chứng minh thư:</Text>
              {!identityCardImage && (
                <TouchableOpacity
                  style={styles.imageBtn}
                  onPress={() => pickImage("identityCardImage")}
                >
                  <Icon name={"camera"} size={15} color={"white"} />
                  <Text style={styles.textImageBtn}>Chọn</Text>
                </TouchableOpacity>
              )}
            </View>
            {identityCardImage && (
              <View style={styles.imageWrapper}>
                <Image
                  style={styles.image}
                  source={identityCardImage}
                  resizeMode={"cover"}
                />
                <TouchableOpacity
                  onPress={() => pickImage("identityCardImage")}
                  style={styles.imageEdit}
                >
                  <View style={styles.imageBtn}>
                    <MaterialIcons name={"edit"} size={15} color={"white"} />
                    <Text style={styles.textImageBtn}>Sửa</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.imgPickWrap}>
              <Text style={styles.label}>Ảnh thẻ Hội viên:</Text>
              {!memberCardImage && (
                <TouchableOpacity
                  style={styles.imageBtn}
                  onPress={() => pickImage("memberCardImage")}
                >
                  <Icon name={"camera"} size={15} color={"white"} />
                  <Text style={styles.textImageBtn}>Chọn</Text>
                </TouchableOpacity>
              )}
            </View>
            {memberCardImage && (
              <View style={styles.imageWrapper}>
                <Image
                  style={styles.image}
                  source={memberCardImage}
                  resizeMode={"cover"}
                />
                <TouchableOpacity
                  onPress={() => pickImage("memberCardImage")}
                  style={styles.imageEdit}
                >
                  <View style={styles.imageBtn}>
                    <MaterialIcons name={"edit"} size={15} color={"white"} />
                    <Text style={styles.textImageBtn}>Sửa</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            <View
              style={{
                width: "100%",
                alignItems: "center",
                marginTop: 20
              }}
            >
              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.btn, styles.signupBtn]}
              >
                <Text style={styles.textButton}>ĐĂNG KÝ</Text>
              </TouchableOpacity>
            </View>
          </React.Fragment>
        );
      }}
    />
  );
};

const mapStateToProps = state => {
  const { netInfo } = state;
  const { type: connectionType } = netInfo;
  const connecting = connectionType !== "none";
  return { connecting };
};

const mapDispatchToProps = dispatch => {
  return {
    showModal: (modalProps, modalType) =>
      dispatch(actions.showModal({ modalProps, modalType })),
    hideModal: () => dispatch(actions.hideModal())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardTabComponent);
