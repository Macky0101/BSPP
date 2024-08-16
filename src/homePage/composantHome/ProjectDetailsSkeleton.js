import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { View } from 'react-native';

const ProjectDetailsSkeleton = () => (
  <View style={{ margin: 16 }}>
    <ContentLoader
      speed={1}
      width={300}
      height={160}
      backgroundColor="#CCCCCC"
      foregroundColor="#ecebeb"
    >
      <Rect x="0" y="0" rx="5" ry="5" width="300" height="20" />
      <Rect x="0" y="30" rx="5" ry="5" width="200" height="20" />
      <Rect x="0" y="60" rx="5" ry="5" width="250" height="20" />
      <Rect x="0" y="90" rx="5" ry="5" width="300" height="20" />
      <Rect x="0" y="120" rx="5" ry="5" width="150" height="20" />
    </ContentLoader>
  </View>
);

export default ProjectDetailsSkeleton;
