import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import styles from '../styles/styles';

const CUISINES = ['All', 'Italian', 'Indian', 'Mexican', 'Chinese', 'Japanese', 'American', 'French', 'Thai'];

const CategoryPills = ({ activeCategory, onSelectCategory }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.pillContainer}
      contentContainerStyle={{ paddingRight: 40 }}
    >
      {CUISINES.map((cuisine) => {
        const isActive = activeCategory === cuisine;
        return (
          <TouchableOpacity
            key={cuisine}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => onSelectCategory(cuisine)}
            activeOpacity={0.8}
          >
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
              {cuisine}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default CategoryPills;
