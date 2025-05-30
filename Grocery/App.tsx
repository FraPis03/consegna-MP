import * as React from 'react';
import {useState,useEffect} from 'react';
import { View, Button,FlatList,Modal,Pressable, ScrollView, Text,ImageBackground, TextInput, StyleSheet} from 'react-native';
import {Checkbox} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';



const Main = ({route,navigation,categories}) => {

  const immagini=[
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIqAVodOcoJeg6Y7aMEPrGPmRADErZiLbQTA&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfzZbAlZwLJNMDuWe7B4yYoarI2n47HW6t0Q&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_B3MoEDwiSL3mIe27pI3iSV1eqd6AKu4a_Q&s',
    'https://www.greenme.it/wp-content/uploads/2016/05/cibo_italiano.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8V67fQJNkhO1kekbCVzVKQ_0UWxCN1OAk0Q&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXCGre1mk7VxBfAdEJOV5dGr6tIfs1dxJYYw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlhuvANjW28ttSUQvL20yeGwBPrRHF7Mgiog&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjQCIXAPjJttVk1QLn-4H7A5DnwUMx68brYw&s',
  ]  

  const[spese,setSpese]=useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  console.log("params",route?.params);

  const getImmagine = (nome: string) => {
  const hash = [...nome].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return immagini[hash % immagini.length];
};
  const modifica=route.params?.modifica; 
  
  const spesa=route.params?.spesa;
  const sp=route.params?.sp;
  const modify=route.params?.modify;

  console.log(modifica,spesa,sp,modify);

  React.useEffect(() => {
  if (!spesa && !modify) return;

  if (modifica === false) {
    setSpese(prev => [...prev, spesa]);
  } else {
    setSpese(prev => {
      const updatedSpese = [...prev];
      const index = updatedSpese.findIndex(item => item.nome === sp?.nome);
      if (index !== -1) {
        updatedSpese[index] = modify;
      }
      return updatedSpese;
    });
  }
}, [modifica, spesa, modify]);

const liste1=route.params?.lista;

const [liste,setListe]= useState([])

React.useEffect(()=>{
  console.log("Nuova lista ricevuta:", liste1);
  if(liste1 && Array.isArray(liste1)){
    setListe(prev=>[...prev,liste1]);}
},[liste1]);

const listaEliminata=route.params?.listaEliminata;

React.useEffect(()=>{
  if(listaEliminata){
    setListe(prev=>{
      return prev.filter((nome1)=>{
        return nome1[0].nome!==listaEliminata;
      })
    });}
},[listaEliminata]);



  console.log("spese",spese);
  console.log("spesa",spesa)
  return(
    <View style={styles.sfondo}>
       <Text style={{color:'white',fontSize:30,borderStyle:'solid',padding:10,
       borderRadius:14,backgroundColor:'red',marginTop:10,width:'100%',textAlign:'center',fontWeight:'bold'
       }}>Grocery</Text>
        <Button title='Ricerca spesa o lista'
        onPress={()=>navigation.navigate('Ricerca', {spese,liste,getImmagine,categories,onReturn:(tab,nome)=>{
          if(tab=='Liste spesa') navigation.navigate(tab,{nome})
          else if(tab=='Main') setSelectedItem(nome)}})}/>


      <Text style={styles.t}>Ultime spese effettuate</Text>
    <View style={{width:'100%',height:150}}>
    <FlatList
 data={[...spese]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 5)}
     keyExtractor={(item, index) => index.toString()}
  contentContainerStyle={{ padding: 10 }}
  renderItem={({ item }) => (
    <View style={{ marginBottom: 15, width: '100%' }}>
      <ImageBackground
        source={{
          uri: getImmagine(item.nome)
        }}
        resizeMode="cover"  
        style={{ borderRadius: 12 }} 
        
        imageStyle={{ borderRadius: 12 }} >
        <Pressable
          onPress={() => setSelectedItem(item)}
          style={{
            ...styles.pre,
            padding: 20, 
            backgroundColor: 'rgba(0, 0, 0, 0.2)',  
            borderRadius: 12, 
          }}
        >
          <Text style={styles.sp1}>{item.nome}</Text>
        </Pressable>
      </ImageBackground>
    </View>
  )}
/>
</View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={!!selectedItem}
        onRequestClose={() => setSelectedItem(null)}
      >
       <BlurView intensity={20} tint="dark" style={{flex:1}}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.titolo}> {selectedItem?.nome}</Text>
            <View style={{alignItems:'flex-start',width:'100%'}}>
            <Text style={styles.opt}>Quantità:<Text style={styles.sp}> {selectedItem?.quantita}</Text></Text>
            <Text style={styles.opt}>Prezzo:<Text style={styles.sp}> {selectedItem?.prezzo}</Text></Text>
            <Text style={styles.opt}>Categoria:<Text style={styles.sp}> {selectedItem?.categoria}</Text></Text>
            <Text style={styles.opt}>Note:<Text style={styles.sp}> {selectedItem?.note}</Text></Text>
            <Text style={styles.opt}>Data:<Text style={styles.sp}> {new Date(selectedItem?.data).toLocaleDateString("it-IT")}</Text></Text>
            </View>
            <Pressable style={styles.but} onPress={() => setSelectedItem(null)}>
              <Text style={styles.sp2}>OK!</Text>
            </Pressable>
            <View
            style={{alignItems:'center',flexDirection:'row',justifyContent:'center',gap:5}}
            >
            <Button
            title='Modifica'
            onPress={()=>{
              navigation.navigate("Add uscita",{modifica:true,spesa:selectedItem});
              setSelectedItem(null);
            }}
            />
            <Button
            title='Elimina'
            onPress={() => {
            setSpese(prev => prev.filter(item => item.nome !== selectedItem.nome));
             setSelectedItem(null);
            }}
            />
            </View>
          </View>
        </View>
      </BlurView>
      </Modal>
      <Text style={{fontWeight:'bold',marginBottom:10}}>Liste della spesa</Text>
      <View style={{flex:2,flexDirection:'column',gap:10,width:'100%'}}>
      <FlatList
 data={[...liste].slice(0,5)}
     keyExtractor={(item, index) => index.toString()}
  contentContainerStyle={{ padding: 10 }}
  renderItem={({ item }) => (
    <View style={{ marginBottom: 15, width: '100%' }}>
      <ImageBackground
        source={{
          uri: getImmagine(item[0].nome)
        }}
        resizeMode="cover"  
        style={{ borderRadius: 12 }} 
        
        imageStyle={{ borderRadius: 12 }} >
        <Pressable
          onPress={() => navigation.navigate("Liste spesa",{nome:item})}
          style={{
            ...styles.pre,
            padding: 20, 
            backgroundColor: 'rgba(0, 0, 0, 0.2)',  
            borderRadius: 12, 
          }}
        >
          <Text style={styles.sp1}>{item[0].nome}</Text>
        </Pressable>
      </ImageBackground>
    </View>
  )}
/>
    </View>
    <View style={{flexDirection:'row',gap:10}}>
    
    <Button 
    title='+ Aggiungi uscita' 
    color='red'
    onPress={()=>{
      navigation.navigate("Add uscita");
    }}
    />
    <Button
  title='+ Aggiungi Lista'
  onPress={() => {
    navigation.navigate("Liste spesa");
  }}
/>
    </View>
  </View>
)};

const AddUscita = ({route,navigation,categories}) => { 
  
  const [spesa,setSpesa]=useState({
    nome:"",
    quantita:"",
    prezzo:"",
    categoria:"",
    note:"",
    data: new Date(),
  });

  const [mod,setMod]=useState(true);

  const p1=route.params?.modifica;
  const p2 = route.params?.spesa;

const p3 = p2 ? {
  ...p2,
  data: p2.data ? new Date(p2.data) : new Date(),
} : null;
  const [val, setVal] = useState(p3 || {
  nome: "",
  quantita: "",
  prezzo: "",
  categoria: "",
  note: "",
  data: new Date(),
});
  useFocusEffect(
  React.useCallback(() => {
    if (p1 && p2) {
      setVal(p2);
      setMod(false);
    } else {
      setMod(true);
      setSpesa({
        nome: "",
        quantita: "",
        prezzo: "",
        categoria: "",
        note: "",
        data: new Date(),
      });
    }
  }, [p1, p2])
);

  console.log(val,spesa,p1,p2,mod)

  
  return mod ? (
  <View style={styles.sfondo}>
    <Text style={{fontSize:30,marginTop:10}}>Aggiungi Spesa</Text>
    <TextInput placeholder='Nome Prodotto' style={styles.casella}
    value={spesa.nome}
    onChangeText={(str)=>{
      setSpesa({...spesa,nome:str})
    }}
    ></TextInput>
    <TextInput placeholder='Quantità' style={styles.casella}
    value={spesa.quantita}
     onChangeText={(str)=>{
      setSpesa({...spesa,quantita:parseInt(str) || 0})
    }}
    ></TextInput>
    <TextInput placeholder='Prezzo' style={styles.casella}
    value={spesa.prezzo}
    onChangeText={(str)=>{
      setSpesa({...spesa,prezzo:parseInt(str) || 0})
    }}
    ></TextInput>
      <Picker
    selectedValue={spesa.categoria}
    style={styles.casella}
    onValueChange={(itemValue) =>
    setSpesa({ ...spesa, categoria: itemValue })
    }>
    <Picker.Item label="Seleziona categoria" value="" />
    {[...(categories || [])].map((cat, index) => (
      <Picker.Item key={index} label={cat} value={cat} />
    ))}
  </Picker>
    <TextInput placeholder='Note' style={styles.casella}
    value={spesa.note}
    onChangeText={(str)=>{
      setSpesa({...spesa,note:str})
    }}
    ></TextInput>
    <Button title='Salva' color='red'
    disabled={spesa.nome.trim() === ''}
    onPress={() => {
  navigation.navigate("Main", {
    spesa: {
      ...spesa,
      quantita: Number(spesa.quantita) || 0,
      prezzo: Number(spesa.prezzo) || 0,
      data: spesa.data.toISOString()
    },
    modifica: false
  }); 
  setMod(true);
  setSpesa({
    nome: "",
    quantita: "",
    prezzo: "",
    categoria: "",
    note: "",
    data: new Date(),
  });
}}
    />
  </View>
  ) : (
   <View style={styles.sfondo}>
    <Text style={{fontSize:30,marginTop:10}}>Modifica Spesa</Text>
    <TextInput placeholder='Nome Prodotto' style={styles.casella}
    value={val.nome}
    onChangeText={(str)=>{
      setVal({...val,nome:str})
    }}
    ></TextInput>
    <TextInput placeholder='Quantità' style={styles.casella}
    value={val.quantita?.toString() || ''}
     onChangeText={(str)=>{
      setVal({...val,quantita:parseInt(str) || 0})
    }}
    ></TextInput>
    <TextInput placeholder='Prezzo' style={styles.casella}
    value={val.prezzo?.toString() || ''}
    onChangeText={(str)=>{
      setVal({...val,prezzo:parseInt(str) || 0})
    }}
    ></TextInput>
    <Picker
    selectedValue={spesa.categoria}
    style={styles.casella}
    onValueChange={(itemValue) =>
    setSpesa({ ...spesa, categoria: itemValue })
    }>
    <Picker.Item label="Seleziona categoria" value="" />
    {[...categories].map((cat, index) => (
      <Picker.Item key={index} label={cat} value={cat} />
    ))}
  </Picker>
    <TextInput placeholder='Note' style={styles.casella}
    value={val.note}
    onChangeText={(str)=>{
      setVal({...val,note:str})
    }}
    ></TextInput>
    <Button
  title='Modifica'
  color='red'
  disabled={val.nome.trim() === ''}
  onPress={() => {
    navigation.navigate("Main", {
      sp: p2,
      modify: {
        ...val,
        data: val.data instanceof Date ? val.data.toISOString() : val.data
      },
      modifica: true
    });
    setMod(true);
    setVal({
      nome: "",
      quantita: 0,
      prezzo: 0,
      categoria: "",
      note: "",
      data: new Date(),
    });
  }}
/>
    <Text style={{fontSize:30}}>Oppure...</Text>
    <Button title="Aggiungi uscita"
    onPress={() => {
    navigation.navigate("Add uscita", { modifica: false, spesa: null });
  }}
    />
  </View>
  )
 };

 const Liste = ({ navigation, route }) => { 

   const immagini=[
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIqAVodOcoJeg6Y7aMEPrGPmRADErZiLbQTA&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfzZbAlZwLJNMDuWe7B4yYoarI2n47HW6t0Q&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_B3MoEDwiSL3mIe27pI3iSV1eqd6AKu4a_Q&s',
    'https://www.greenme.it/wp-content/uploads/2016/05/cibo_italiano.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8V67fQJNkhO1kekbCVzVKQ_0UWxCN1OAk0Q&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXCGre1mk7VxBfAdEJOV5dGr6tIfs1dxJYYw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlhuvANjW28ttSUQvL20yeGwBPrRHF7Mgiog&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjQCIXAPjJttVk1QLn-4H7A5DnwUMx68brYw&s',
  ]  

  const getImmagine = (nome: string) => {
  const hash = [...nome].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return immagini[hash % immagini.length];
};
  
  const [liste, setListe] = useState([]);
  const [lista, setLista] = useState([]);
  const [view, setView] = useState('liste');
  const [nomeLista, setNomeLista] = useState('');
  const [nomeProdotto, setNomeProdotto] = useState('');
  const [disatt, setDisabled] = useState(true);
  const [sel, setSel] = useState([]);

  let listaVisualizza = route.params?.nome;

  useEffect(() => {
    if (listaVisualizza) {
      setView('lista');
      setSel(listaVisualizza);
      navigation.setParams({ nome: undefined });
    }
  }, [listaVisualizza]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, gap: 10, alignItems: 'center' }}>
        <Text style={{
          color: 'white',
          fontSize: 30,
          padding: 10,
          borderRadius: 14,
          backgroundColor: 'red',
          marginTop: 10,
          width: '100%',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Liste della Spesa
        </Text>

        
        <View style={{ display: view === 'liste' ? 'flex' : 'none', flex: 1, flexDirection: 'column', gap: 10, width: '90%' }}>
          <FlatList
            data={liste}
            renderItem={({ item }) => (
              <View style={{ flex: 1, flexDirection: 'column', width: '100%',marginBottom:15}}>
                <ImageBackground
        source={{
          uri: getImmagine(item[0].nome)
        }}
        resizeMode="cover"  
        style={{ borderRadius: 12 }} 
        
        imageStyle={{ borderRadius: 12 }} >
                <Pressable
                  onPress={() => {
                    setView('lista');
                    setSel(item);
                  }}
                  style={[styles.pre, {
                    padding: 20, 
            backgroundColor: 'rgba(0, 0, 0, 0.2)',  
            borderRadius: 12, 
                  }]}
                >
                  <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center',color:'white' }}>
                    {item[0]?.nome}
                  </Text>
                </Pressable>
                </ImageBackground>
              </View>
            )}
          />
          <View style={{ marginTop: 20, marginBottom: 10, alignItems: 'center' }}>
            <Button title='Aggiungi lista' onPress={() => setView('add')} />
          </View>
        </View>

        <View style={{ display: view === 'add' ? 'flex' : 'none', flex: 1, flexDirection: 'column', gap: 10 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', marginTop: 10, color: 'red', textAlign: 'center' }}>Lista</Text>
          <TextInput
            placeholder='Nome della lista'
            value={nomeLista}
            onChangeText={(text) => {
              setNomeLista(text);
              setDisabled(text === '');
            }}
            style={[styles.casella, { marginTop: 10 }]}
          />
          <View style={{ flex: 1, flexDirection: 'column', gap: 10 }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', marginTop: 10, color: 'red' }}>Prodotti della Lista</Text>
            <FlatList
              data={lista}
              renderItem={({ item }) => (
                <Text style={{ fontSize: 30, fontWeight: 'bold', marginTop: 10 }}>{item.nome}</Text>
              )}
            />
            <TextInput
              placeholder='Nome prodotto'
              value={nomeProdotto}
              onChangeText={(text) => setNomeProdotto(text)}
              style={[styles.casella, { marginBottom: 10 }]}
            />
            <Button
              title='aggiungi prodotto'
              onPress={() => {
                if (nomeProdotto !== '') {
                  setLista(prev => [...prev, { nome: nomeProdotto, check: false }]);
                  setNomeProdotto('');
                }
              }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                title='Salva'
                disabled={disatt}
                color='red'
                onPress={() => {
                  const nuovaLista = [{ nome: nomeLista }, ...lista];
                  setListe(prev => [...prev, nuovaLista]);
                  setNomeLista('');
                  setNomeProdotto('');
                  setLista([]);
                  setView('liste');
                  setDisabled(true);
                  navigation.navigate("Main", { lista: nuovaLista });
                }}
              />
              <Button title='Annulla' color='red' onPress={() => setView('liste')} />
            </View>
          </View>
        </View>

        <View style={{ display: view === 'lista' ? 'flex' : 'none', width: '100%', alignItems: 'center' }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 10, color: 'red' }}>{sel[0]?.nome}</Text>
          <FlatList
            data={sel.slice(1)}
            renderItem={({ item, index }) => (
              <View>
                <Text style={{
                  textDecorationLine: item.check ? 'line-through' : 'none',
                  fontSize: 20,
                  fontWeight: 'bold',
                  padding: 5
                }}>
                  <Checkbox
                status={item.check ? 'checked' : 'unchecked'}
               onPress={() => {
                 const nuovaSel = [...sel];
               nuovaSel[index+1] = {
                 ...nuovaSel[index+1],
                check: !nuovaSel[index+1].check,
                 };
                 setSel(nuovaSel);
                 }}
                 style={{ marginRight: 5 }}
                  />
                 {item.nome}
                </Text>
              </View>
            )}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginTop: 20 }}>
            <Button title='Chiudi' onPress={() => { setView('liste'); setSel([]); }} />
            <Button
              title='Elimina'
              color='red'
              onPress={() => {
                setListe(prev => prev.filter(l => l[0]?.nome !== sel[0]?.nome));
                setSel([]);
                setView('liste');
                navigation.navigate("Main", { listaEliminata: sel[0]?.nome });
              }}
            />
          </View>
        </View>

      </View>
    </View>
  );
};

const Ricerca = ({navigation, route}) => {
  const spese=route.params?.spese ?? [];
  const liste=route.params?.liste ?? [];
  const getImmagine=route.params?.getImmagine;
  const [viewFiltri,setViewFiltri]=useState(false);
  const [ricerca,setRicerca]=useState('');
  const [range, setRange]=useState([0, 1000]);
  const [categoria,setCategoria]=useState('');
  const categorie=route.params?.categories ?? [];

  const speseFiltrate = spese.filter(spesa=>
    (spesa.nome.toLowerCase().includes(ricerca.toLowerCase())||(spesa.data.includes(ricerca)))&&(categoria==''||spesa.categoria==categoria)&&(spesa.prezzo>=range[0]&&spesa.prezzo<=range[1]));
  const listeFiltrate = liste.filter(lista=>
    lista[0].nome.toLowerCase().includes(ricerca.toLowerCase())||lista.some(prod=>prod.nome.toLowerCase().includes(ricerca.toLowerCase())));

  return (
    <View showsVerticalScrollIndicator={false} style={styles.sfondoCat} contentContainerStyle={{alignItems:'center'}}>
      <View style={{flexDirection:'row'}}>
        <TextInput
          style={styles.casella}
          placeholder="Inserisci la spesa o lista da ricercare"
          value={ricerca} onChangeText={setRicerca}/>
        <Button title='Filtri' onPress={()=>setViewFiltri(!viewFiltri)}/>
      </View>
      <View style={{backgroundColor:'lightgray',width:300,display:viewFiltri ? 'flex' : 'none'}}>
        <Picker
          selectedValue={categoria}
          style={styles.casella}
          onValueChange={(categoria)=>setCategoria(categoria)}>
          <Picker.Item label="Seleziona categoria" value="" />
          {[...(categorie || [])].map((cat, index)=>(
          <Picker.Item key={index} label={cat} value={cat} />))}
        </Picker>
        <View style={{flexDirection:'row', gap:0}}>
        <Text>Min:{range[0]} Max:{range[1]}</Text>
        </View>        
        <MultiSlider
        values={[range[0], range[1]]}
        min={0}
        max={1000}
        step={1}
        onValuesChange={(values) => setRange(values)}/>
      </View>
      <Text>Spese:</Text>
      <FlatList data={speseFiltrate}
      renderItem={({ item }) => (
        <View style={{ marginBottom: 15, width: '100%' }}>
              <ImageBackground
                source={{
                  uri: getImmagine(item.nome),
                }}
                resizeMode="cover"
                style={{ borderRadius: 12 }}
                imageStyle={{ borderRadius: 12 }}>
                <Pressable
                  onPress={() =>{route.params.onReturn('Main',item);}}
                  style={{
                    ...styles.pre,
                    padding: 20,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 12,
                  }}>
                  <Text style={styles.sp1}>{item.nome}</Text>
                </Pressable>
              </ImageBackground>
            </View>)}
      ListEmptyComponent={<Text>Nessuna spesa trovata!</Text>}/>

      <Text>Liste:</Text>
      <FlatList data={listeFiltrate}
      renderItem={({ item }) => (
      <View style={{ marginBottom: 15, width: '100%' }}>
              <ImageBackground
                source={{
                  uri: getImmagine(item[0].nome),
                }}
                resizeMode="cover"
                style={{ borderRadius: 12 }}
                imageStyle={{ borderRadius: 12 }}>
                <Pressable
                  onPress={() =>{route.params.onReturn('Liste spesa',item)}}
                  style={{
                    ...styles.pre,
                    padding: 20,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 12,
                  }}>
                  <Text style={styles.sp1}>{item[0].nome}</Text>
                </Pressable>
              </ImageBackground>
            </View>)}
      ListEmptyComponent={<Text>Nessuna spesa trovata!</Text>}/>
    </View>
  );
};

const Categorie = ({ navigation,categories, setCategories }) => {

  const aggiungiCategoria = (nuovaCategoria: string) => {
    setCategories(prev => [...prev, nuovaCategoria]);
  };

  return (
    <View style={styles.sfondoCat} contentContainerStyle={{alignItems:'center'}}>
      <Text style={{fontSize:50,marginTop:50}}>Categorie</Text>
      <FlatList
        data={categories}
        contentContainerStyle={{paddingHorizontal: 15, paddingTop: 20,}}
        renderItem={({ item }) => (
          <View style={styles.categoriaItem}>
            <Text style={{fontSize: 18, color: '#black'}}>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => item + index.toString()}
      />
      
      <View style={{backgroundColor:'white',margin:10,marginTop:50,marginBottom:50}}>
        <Button
          title='+ Aggiungi Categoria'
          onPress={() => navigation.navigate('AggiungiCategoria', { aggiungiCategoria })}
        />
      </View>
    </View>
  );
};


const AggiungiCategoria = ({navigation, route}) => {
  const [nomeCategoria, setNomeCategoria] = useState('');
  const { aggiungiCategoria } = route.params;
  
  return (
     <ScrollView style={styles.sfondoCat} contentContainerStyle={{alignItems:'center'}}>
      <View style={{flex:1, padding:25, gap: 30, justifyContent: 'center',}}>
        <Text style={{fontSize:30, marginTop:10, textAlign: 'center',}}>Nuova Categoria</Text>
        
        <TextInput
          value = {nomeCategoria}
          placeholder='es. frutta, verdura ...' 
          placeholderTextColor="#666"
          style={styles.casella}
          onChangeText={(str) => {
            setNomeCategoria(str); 
          }}
        /> 
        
        <Button
          title="Salva"
          onPress={() => {
            if (nomeCategoria.trim()) {
              aggiungiCategoria(nomeCategoria.trim());
              navigation.goBack();
            } 
          }}
        />
      </View>
    </ScrollView>
  );
};


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Home({navigation,route}) {
  const param=route.params?.modifica;
  const param1=route.params?.spesa;
  const [categories, setCategories] = useState([]);
  return (
    <Tab.Navigator screenOptions={{
    tabBarActiveTintColor: 'red',tabBarInactiveTintColor: 'black', tabBarStyle:{backgroundColor:'white'}
  }}
>
  <Tab.Screen
  name="Main"
  children={(props) => <Main {...props} categories={categories} />}
  options={{headerShown:false}}

  />
   
      <Tab.Screen name="Add uscita" children={(props) => <AddUscita {...props} categories={categories} />} options={{headerShown:false}}/>
      <Tab.Screen name="Liste spesa" component={Liste} options={{headerShown:false}}/>
      <Tab.Screen name="Categorie" children={(props) => <Categorie {...props} categories={categories} setCategories={setCategories} />} options={{headerShown:false}}/>
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{headerShown:false}} />
        <Stack.Screen name='Ricerca' component={Ricerca}/>
        <Stack.Screen name="Categorie" component={Categorie} />
        <Stack.Screen name="AggiungiCategoria" component={AggiungiCategoria} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles=StyleSheet.create({
  sfondo:{
   backgroundColor:'white',
   flex:1, 
   alignItems:'center',
   flexDirection:'column',
   gap:15,
  },
  sfondoCat:{
    backgroundColor:'white',
   flex:1, 
   flexDirection:'column',
   gap:15,
  },
  casella:{
    backgroundColor:'lightgrey',
    borderWidth:2, 
    width:250, 
    borderColor:'grey',
    borderRadius:14,
    padding:10
    },
  sp:{
    color:'white',
    fontSize:20,
    padding:5,
    fontWeight:'bold',
    textAlign:'center'
  },
  sp1:{
    fontSize:30,
    padding:5,
    fontWeight:'bold',
    color:'white',
    textAlign:'center'
  },
  sp2:{
    fontSize:20,
    padding:5,
    color:'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'lightgray',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  but:{
    color:'red',
    padding:5,
    backgroundColor:'red',
    borderRadius:14,
    marginBottom:5,
    marginTop:5
  },
  t:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize:15,
    marginTop:10,
    marginBottom:10,
  },
  pre:{
    borderRadius:12,
    width:'100%'
  },
  titolo:{
    fontSize:30,
    marginBottom:5,
    fontWeight:'bold',
    color:'white',
    textAlign:'center' 
  },
  opt:{
    color:'white',
    marginBottom:5
  },
  categoriaItem: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: 60
  },
})

export default App;
