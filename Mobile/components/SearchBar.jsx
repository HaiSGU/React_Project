import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import React from 'react';
import colors from '@shared/theme/colors';

/**
 * SearchBar component cho Mobile (React Native)
 * @param {string} value - Giá trị search
 * @param {function} onChangeText - Callback khi text thay đổi
 * @param {string} placeholder - Placeholder text
 * @param {function} onClear - Callback khi clear search
 * @param {object} style - Custom style
 */
const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = 'Tìm kiếm...', 
  onClear,
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={onClear} style={styles.clearButton}>
          <Text style={styles.clearText}>✕</Text>
        </Pressable>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearText: {
    fontSize: 18,
    color: '#999',
    fontWeight: 'bold',
  },
});
