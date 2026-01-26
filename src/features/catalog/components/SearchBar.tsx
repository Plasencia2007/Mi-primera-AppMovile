import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors, spacing } from '../../../theme';

export const SearchBar = () => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchWrapper}>
        <Search size={20} color="#8E8E93" />
        <TextInput 
          placeholder="Search for dishes or restaurants" 
          style={styles.searchInput}
          placeholderTextColor="#8E8E93"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.text,
  },
});
