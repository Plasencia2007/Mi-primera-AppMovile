import React from 'react';
import { StyleSheet, View, Text, StyleProp, ViewStyle } from 'react-native';
import { Star, StarHalf } from 'lucide-react-native';
import { colors } from '../../theme';

interface RatingProps {
  value: number;
  max?: number;
  size?: number;
  showText?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Rating = ({ 
  value, 
  max = 5, 
  size = 16, 
  showText = false,
  style 
}: RatingProps) => {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;

  for (let i = 1; i <= max; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star 
          key={i} 
          size={size} 
          color="#FFB800" 
          fill="#FFB800" 
          style={styles.star} 
        />
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <View key={i} style={styles.star}>
          <StarHalf 
            size={size} 
            color="#FFB800" 
            fill="#FFB800" 
          />
        </View>
      );
    } else {
      stars.push(
        <Star 
          key={i} 
          size={size} 
          color="#E9ECEF" 
          fill="#E9ECEF" 
          style={styles.star} 
        />
      );
    }
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsRow}>
        {stars}
      </View>
      {showText ? (
        <Text style={[styles.ratingText, { fontSize: size * 0.9 }]}>
          {value.toFixed(1)}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFB800',
    marginLeft: 6,
  },
});
