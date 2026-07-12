import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';

export default function DynamicTaskForm({ schema, onSubmit, isLoading }) {
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    schema.forEach(field => {
      if (field.type === 'date') {
        initialData[field.name] = new Date().toISOString().split('T')[0];
      }
    });
    return initialData;
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImagePick = async (name) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      handleChange(name, result.assets[0]);
    }
  };

  const handleVideoPick = async (name) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) {
      handleChange(name, result.assets[0]);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <View style={styles.formContainer}>
      {schema.map((field) => (
        <View key={field.name} style={styles.fieldContainer}>
          <Text style={styles.label}>{field.label} {field.required && '*'}</Text>
          {field.type === 'select' ? (
            <View style={styles.selectContainer}>
              {/* Note: Simplified Select for MVP. In a real app, use a Picker component. */}
              {field.options.map(opt => (
                <TouchableOpacity 
                  key={opt}
                  style={[styles.selectOption, formData[field.name] === opt && styles.selectOptionActive]}
                  onPress={() => handleChange(field.name, opt)}
                >
                  <Text style={[styles.selectOptionText, formData[field.name] === opt && styles.selectOptionTextActive]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : field.type === 'platform-metric' ? (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8}}>
                {field.options.map(opt => (
                  <TouchableOpacity 
                    key={opt}
                    style={[styles.selectOption, formData[`${field.name}Channel`] === opt && styles.selectOptionActive, {paddingVertical: 8, paddingHorizontal: 12}]}
                    onPress={() => handleChange(`${field.name}Channel`, opt)}
                  >
                    <Text style={[styles.selectOptionText, formData[`${field.name}Channel`] === opt && styles.selectOptionTextActive, {fontSize: 12}]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TextInput
                style={[styles.input, {width: 80, height: 40, padding: 8, textAlign: 'center'}]}
                value={formData[`${field.name}Count`] || ''}
                onChangeText={(val) => handleChange(`${field.name}Count`, val)}
                keyboardType="numeric"
                placeholder="Count"
              />
            </View>
          ) : field.type === 'image' ? (
            <View>
              <TouchableOpacity style={styles.imageBtn} onPress={() => handleImagePick(field.name)}>
                <Text style={styles.imageBtnText}>
                  {formData[field.name] ? 'Change Image' : 'Select Image'}
                </Text>
              </TouchableOpacity>
              {formData[field.name] && formData[field.name].uri && (
                <Image source={{ uri: formData[field.name].uri }} style={styles.previewImage} />
              )}
            </View>
          ) : field.type === 'video' ? (
            <View>
              <TouchableOpacity style={styles.imageBtn} onPress={() => handleVideoPick(field.name)}>
                <Text style={styles.imageBtnText}>
                  {formData[field.name] ? 'Change Video' : 'Select Video'}
                </Text>
              </TouchableOpacity>
              {formData[field.name] && formData[field.name].uri && (
                <Text style={{marginTop: 8, color: colors.primary, fontSize: 12, fontWeight: '600'}}>
                  ✓ Video selected
                </Text>
              )}
            </View>
          ) : (
            <TextInput
              style={[styles.input, field.type === 'textarea' && styles.textArea]}
              value={formData[field.name] || ''}
              onChangeText={(val) => handleChange(field.name, val)}
              keyboardType={field.type === 'number' ? 'numeric' : 'default'}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              multiline={field.type === 'textarea' || (field.type === 'text' && field.name === 'remarks')}
              textAlignVertical={field.type === 'textarea' ? 'top' : 'center'}
            />
          )}
        </View>
      ))}
      <TouchableOpacity style={[styles.submitBtn, isLoading && {opacity: 0.7}]} onPress={handleSubmit} disabled={isLoading}>
        <Text style={styles.submitBtnText}>{isLoading ? 'Submitting...' : 'Submit Task'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: colors.background,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  selectOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectOptionText: {
    fontSize: 12,
    color: colors.textLight,
  },
  selectOptionTextActive: {
    color: colors.card,
  },
  submitBtn: {
    backgroundColor: colors.success,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  imageBtn: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  imageBtnText: {
    color: colors.primary,
    fontWeight: '600'
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: 'cover'
  },
  submitBtnText: {
    color: colors.card,
    fontWeight: 'bold',
    fontSize: 16,
  }
});
