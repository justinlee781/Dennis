import React, { useEffect, useState } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator
} from "react-native";
import assets from "../../assets/assets";
import Typo from "../../components/utils/Typo";
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { dbFS } from "../../config/firebase";
import useStore from "../../store";
import Theme from "../../src/Theme";
import Space from "../../components/utils/Space";
import FullButton from "../../components/Buttons/FullButton";

function OrderConfirmation({navigation,route}){
    const {cartItems,total,selectedAddress,txnDetails,shippingFee,platformCharges} = route.params
    const userData = useStore((state) => state.userData);
    const [loading,setLoading] = useState(true) 
    const [orderid,setorderid] = useState(null)

    async function generateUniqueOrderId() {
        const prefix = "ODITMP";
        let orderId = "";
    
        try {
            // Get the count of existing orders
            const querySnapshot = await getDocs(collection(dbFS, "orders"));
            const orderCount = querySnapshot.size + 1;
    
            // Generate the order ID with incremental number
            orderId = prefix + orderCount.toString().padStart(7, "0");
    
            // Check if the generated order ID already exists
            const orderDocRef = doc(dbFS, "orders", orderId);
            const orderDocSnap = await getDoc(orderDocRef);
    
            if (orderDocSnap.exists()) {
                // If the order ID already exists, generate a new one recursively
                return generateUniqueOrderId();
            } else {
                // If the order ID doesn't exist, return it
                return orderId;
            }
        } catch (error) {
            console.error("Error generating order ID:", error);
            throw error;
        }
    }
    
    const createOrder = async () => {
        try {
            const orderId = await generateUniqueOrderId();           
            const orderRef = doc(dbFS, "orders", orderId);
            await setDoc(orderRef, { 
                buyerID:userData.userID,
                sellerID:cartItems[0].postedByUserID,
                productID:cartItems[0].id,
                productCategory:cartItems[0].category,
                productAllDetails:cartItems[0],
                orderPlacedOn:serverTimestamp(),
                orderStatus:"active",
                orderTotal:total,
                shippingAddress:selectedAddress,
                txnDetails:txnDetails,
                shippingFee:shippingFee,
                platformCharges:platformCharges      
             });
            console.log("Order created successfully with ID:", orderId);
            setorderid(orderId)
        } catch (error) {
            console.log("Error creating order:", error);
        }
    };

    const markAsSold = async (documentRef) => {
        try {
            // Update the document by setting the markAssold property to true
            await updateDoc(documentRef, {
                sold: true,
                soldTo:userData.userID,
                orderID:orderid,
            });
        } catch (error) {
            console.error("Error marking document as sold:", error);
            throw error;
        }
    };

    useEffect(() => {       
        createOrder()         
    }, []);

    useEffect(() => {
      if(orderid){
        const orderRef = doc(dbFS, cartItems[0].category, cartItems[0].id);
        markAsSold(orderRef).then(() => setLoading(false));
      }        
    }, [orderid]);

    if(loading){
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Theme.primaryColor} />
            </View>
        );
    }

    return(
    <View style={styles.container}>
        <Image source={assets.orderconfirm} style={{height:255,width:255,resizeMode:'contain'}} />
        <Typo xl bold>Order Placed!</Typo>
        <Typo l grey center>Your order has been placed with the{"\n"} Order ID : {orderid} </Typo>
        <Space space={15}/>
        <FullButton handlePress={()=>navigation.navigate('MainRoute', {screen: 'Orders'})} color={Theme.primaryColor} label={"View My Orders"}/>
    </View>
    );
}
export default OrderConfirmation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
        paddingHorizontal:20
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});
