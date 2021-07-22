const mockData = [
  {
    nickName: '子晦',
    avatarUrl: '//work.alibaba-inc.com/photo/120232.jpg',
  },
  {
    nickName: '添星',
    avatarUrl: '//work.alibaba-inc.com/photo/148492.jpg',
  },
  {
    nickName: '辣堡',
    avatarUrl: '//work.alibaba-inc.com/photo/156944.jpg',
  },
  {
    nickName: '于咸',
    avatarUrl: '//work.alibaba-inc.com/photo/236652.jpg',
  },
  {
    nickName: '空晚',
    avatarUrl: '//work.alibaba-inc.com/photo/236732.jpg',
  },
  {
    nickName: '松篁',
    avatarUrl: '//work.alibaba-inc.com/photo/237344.jpg',
  },
  {
    nickName: '國凯',
    avatarUrl: '//work.alibaba-inc.com/photo/246084.jpg',
  },
  {
    nickName: '子晞',
    avatarUrl: '//work.alibaba-inc.com/photo/246956.jpg',
  },
  {
    nickName: '奴心',
    avatarUrl: '//work.alibaba-inc.com/photo/247420.jpg',
  },
  {
    nickName: '尘蹊',
    avatarUrl: '//work.alibaba-inc.com/photo/251228.jpg',
  },
];

export function getCustomMock(fieldName: string, randomSeed: number) {
  return mockData[Math.floor(randomSeed * mockData.length)][fieldName];
}
