
 <View style={styles.newsContentLine}>
 
  <Text numberOfLines={1} style={styles.newsHeader}>
            {this.props.item.title}
            </Text>

        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() =>  Actions.story({
               eventTitle: this.props.item.title,
               eventDescription: this.props.item.description,
               eventDate: this.props.item.eventDate,
               eventStartTime: this.props.item.eventStartTime,
               eventEndTime: this.props.item.eventEndTime,
               location: '',
               eventImage: '',
               phone: '',
               email: '',
               color: '',
               photo1: this.props.item.photo1,
               photo2: this.props.item.photo2,
               photo3: this.props.item.photo3,
               url: this.props.item.url

             })
  
           }>


          <Image  source={{uri: `${photo1}`}} style={styles.newsImage} />


          <View style={styles.newsContentNoLine}>
            <Text numberOfLines={1} style={styles.newsHeader}>
            {this.props.item.title}
            </Text>

            <Text style={styles.newsTypeText}>
                {this.props.item.description}
            </Text>

          <View style={{flexDirection: 'column'}}>
            <Text numberOfLines={1} style={ styles.newsLink}></Text>
            <Text style={styles.newsLink}></Text>
          </View>
          </View>




        </TouchableOpacity>
      </View>