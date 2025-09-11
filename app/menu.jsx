import { Appearance, StyleSheet, View, Text, Image, ScrollView, Platform, SafeAreaView, TouchableOpacity, FlatList} from "react-native";
import { Colors } from "@/constants/Colors";
import { MENU_ITEMS } from '@/constants/MenuItems'
import MENU_IMAGES from '@/constants/MenuImages'
import { Button } from "@react-navigation/elements";

export default function MenuScreen(){
    const colorScheme = Appearance.getColorScheme()
    const theme = colorScheme === 'dark' ? Colors.dark:Colors.light;
    const style = createStyles(theme, colorScheme)
    const Container = Platform.OS ==='web'? ScrollView: SafeAreaView;

    const separatorComp = <View style={style.separator}/>
    //const headerComp= <Text>Top of List</Text>
    const footerComp= <Text style={{color: theme.text}}>End of Menu</Text>

    return(
        <Container>
            <FlatList 
              data={MENU_ITEMS}
              keyExtractor={(item)=>item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={StyleSheet.contentContainer}
              ItemSeparatorComponent={separatorComp}
              //ListHeaderComponent={headerComp}
              ListFooterComponent={footerComp}
              ListFooterComponentStyle={style.footerComp}
              ListEmptyComponent={<Text>No items</Text>}
              renderItem={({ item }) => (
                <View style={style.row}>
                    <View style={style.menuTextRow}>
                        <Text style={style.menuItemTitle}>{item.title}</Text>
                        <Text style={style.menuItemText}>{item.description}</Text>
                        <TouchableOpacity style={style.Orderbutton}>
                           <Text style={style.ButtonText}>Order Now</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <Image
                       source={MENU_IMAGES[item.id - 1]}
                       style={style.menuImage}
                       />
                </View>

              )}>
            </FlatList>

        </Container>
    )
}

function createStyles(theme, colorScheme){
    return StyleSheet.create({
        contentContainer: {
            paddingTop:10,
            paddingBottom:20,
            paddingHorizontal:12,
            backgroundColor: theme.background,
        },
        separator: {
            height:1,
            backgroundColor: colorScheme ==='dark' ?'papayawhip':"#000",
            width:'50%',
            maxWidth:300,
            marginHorizontal:'auto',
            marginBottom:10,
        },
        footerComp: {
            
            marginHorizontal: 'auto'
        },
        row: {
            flexDirection: 'row',
            width: '100%',
            maxWidth: 600,
            height: 100,
            marginBottom: 10,
            borderStyle: 'solid',
            borderColor: colorScheme === 'dark' ? 'papayawhip':'#000',
            borderWidth: 1,
            borderRadius: 20,
            overflow: 'hidden',
            marginHorizontal: 'auto',
        },
        menuTextRow: {
            width: '65%',
            paddingTop: 10,
            paddingLeft:10,
            paddingRight:5,
            flexGrow:1,
        },
        menuItemTitle:{
            fontSize: 18,
            textDecorationLine: 'underline',

        },
        menuItemText:{
            color:theme.text,
        },
        menuImage:{
            width:100,
            height:100,
        },
        Orderbutton: {
            width:'50%',
            height: '50%',
            backgroundColor: "#000",   
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 30,             
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,  
        },
        ButtonText: {
            color: "#fff",
            fontSize: 16,
            fontWeight: "600",
            letterSpacing: 1,
        }

    })
}