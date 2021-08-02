//import * as faker from 'faker';
import { GraphQLLeafType } from 'graphql';
import * as moment from 'moment';
import { ID } from 'type-graphql';
import { getCustomMock } from './utils';
import faker = require('faker');

export function getRandomInt(min: number, max: number) {
  return faker.random.number({ min, max });
}

export function getRandomItem<T>(array: ReadonlyArray<T>): T {
  return array[getRandomInt(0, array.length - 1)];
}

export const stdScalarFakers = {
  Int: () => faker.random.number({ min: 0, max: 99999, precision: 1 }),
  Float: () => faker.random.number({ min: 0, max: 99999, precision: 0.01 }),
  String: () => 'string',
  Boolean: () => faker.random.boolean(),
  ID: () => toBase64(faker.random.number({ max: 9999999999 }).toString()),
};

function toBase64(str) {
  return Buffer.from(str).toString('base64');
}

const fakeFunctions = {
  // Address section
  zipCode: () => faker.address.zipCode(),
  city: () => faker.address.city(),
  // Skipped: faker.address.cityPrefix
  // Skipped: faker.address.citySuffix
  streetName: () => faker.address.streetName(),
  streetAddress: {
    args: ['useFullAddress'],
    func: useFullAddress => faker.address.streetAddress(useFullAddress),
  },
  // Skipped: faker.address.streetSuffix
  // Skipped: faker.address.streetPrefix
  secondaryAddress: () => faker.address.secondaryAddress(),
  county: () => faker.address.county(),
  country: () => faker.address.country(),
  countryCode: () => faker.address.countryCode(),
  state: () => faker.address.state(),
  stateAbbr: () => faker.address.stateAbbr(),
  latitude: () => faker.address.latitude(),
  longitude: () => faker.address.longitude(),

  // Commerce section
  colorName: () => faker.commerce.color(),
  productCategory: () => faker.commerce.department(),
  productName: () => faker.commerce.productName(),
  money: {
    args: ['minMoney', 'maxMoney', 'decimalPlaces'],
    func: (min, max, dec) => faker.commerce.price(min, max, dec),
  },
  // Skipped: faker.commerce.productAdjective
  productMaterial: () => faker.commerce.productMaterial(),
  product: () => faker.commerce.product(),

  // Company section
  // Skipped: faker.company.companySuffixes
  companyName: () => faker.company.companyName(),
  // Skipped: faker.company.companySuffix
  companyCatchPhrase: () => faker.company.catchPhrase(),
  companyBs: () => faker.company.bs(),
  // Skipped: faker.company.catchPhraseAdjective
  // Skipped: faker.company.catchPhraseDescriptor
  // Skipped: faker.company.catchPhraseNoun
  // Skipped: faker.company.companyBsAdjective
  // Skipped: faker.company.companyBsBuzz
  // Skipped: faker.company.companyBsNoun

  // Database section
  dbColumn: () => faker.database.column(),
  dbType: () => faker.database.type(),
  dbCollation: () => faker.database.collation(),
  dbEngine: () => faker.database.engine(),

  // Date section
  date: {
    args: ['dateFormat', 'dateFrom', 'dateTo'],
    func: (dateFormat, dateFrom, dateTo) =>
      moment(faker.date.between(dateFrom, dateTo))
        .format(dateFormat)
        .toString(),
  },
  pastDate: {
    args: ['dateFormat'],
    func: dateFormat => moment(faker.date.past()).format(dateFormat),
  },
  futureDate: {
    args: ['dateFormat'],
    func: dateFormat => moment(faker.date.future()).format(dateFormat),
  },
  recentDate: {
    args: ['dateFormat'],
    func: dateFormat => moment(faker.date.recent()).format(dateFormat),
  },

  // Finance section
  financeAccountName: () => faker.finance.accountName(),
  //TODO: investigate finance.mask
  financeTransactionType: () => faker.finance.transactionType(),
  currencyCode: () => faker.finance.currencyCode(),
  currencyName: () => faker.finance.currencyName(),
  currencySymbol: () => faker.finance.currencySymbol(),
  bitcoinAddress: () => faker.finance.bitcoinAddress(),
  internationalBankAccountNumber: () => faker.finance.iban(),
  bankIdentifierCode: () => faker.finance.bic(),

  // Hacker section
  hackerAbbreviation: () => faker.hacker.abbreviation(),
  hackerPhrase: () => faker.hacker.phrase(),

  // Image section
  imageUrl: {
    args: ['imageSize', 'imageKeywords', 'randomizeImageUrl'],
    func: (size, keywords, randomize) => {
      let url = 'https://source.unsplash.com/random/';

      if (size != null) {
        url += `${size.width}x${size.height}/`;
      }

      if (keywords != null && keywords.length > 0) {
        url += '?' + keywords.join(',');
      }

      if (randomize === true) {
        url += '#' + faker.random.number();
      }

      return url;
    },
  },

  // Internet section
  // avatarUrl: () => faker.internet.avatar(),
  avatarUrl: {
    args: ['randomSeed'],
    func: randomSeed => {
      if (randomSeed) {
        return getCustomMock('avatarUrl', randomSeed);
      } else return faker.internet.avatar();
    },
  },
  email: {
    args: ['emailProvider'],
    func: provider => faker.internet.email(undefined, undefined, provider),
  },
  url: () => faker.internet.url(),
  domainName: () => faker.internet.domainName(),
  ipv4Address: () => faker.internet.ip(),
  ipv6Address: () => faker.internet.ipv6(),
  userAgent: () => faker.internet.userAgent(),
  colorHex: {
    args: ['baseColor'],
    func: ({ red255, green255, blue255 }) => {
      return faker.internet.color(red255, green255, blue255);
    },
  },
  macAddress: () => faker.internet.mac(),
  password: {
    args: ['passwordLength'],
    func: len => faker.internet.password(len),
  },

  // Lorem section
  lorem: {
    args: ['loremSize'],
    func: size => faker.lorem[size || 'paragraphs'](),
  },

  // Name section
  firstName: () => faker.name.firstName(),
  lastName: () => faker.name.lastName(),
  fullName: () => faker.name.findName(),
  jobTitle: () => faker.name.jobTitle(),

  // Phone section
  phoneNumber: () => faker.phone.phoneNumber(),
  // Skipped: faker.phone.phoneNumberFormat
  // Skipped: faker.phone.phoneFormats

  // Random section
  number: {
    args: ['minNumber', 'maxNumber', 'precisionNumber'],
    func: (min, max, precision) => faker.random.number({ min, max, precision }),
  },
  uuid: () => faker.random.uuid(),
  word: () => faker.random.word(),
  words: () => faker.random.words(),
  locale: () => faker.random.locale(),

  // System section
  // Skipped: faker.system.fileName
  // TODO: Add ext and type
  filename: () => faker.system.commonFileName(''),
  mimeType: () => faker.system.mimeType(),
  // Skipped: faker.system.fileType
  // Skipped: faker.system.commonFileType
  // Skipped: faker.system.commonFileExt
  fileExtension: () => faker.system.fileExt(''),
  semver: () => faker.system.semver(),
};
const smartFakerFunctions = {
  // 新增 intermock 里的'智能' mock
  '^.*(name|Name)$': () => faker.name.findName(),
  '^.*(id|Id)$': (type: GraphQLLeafType) =>
    type === ID ? faker.random.uuid() : faker.random.number(),
  middleName: () => faker.name.firstName(),
  // nickName: () => faker.name.findName(),
  // nickName: () => faker.name.lastName(),
  nickName: {
    args: ['randomSeed'],
    func: randomSeed => {
      if (randomSeed) {
        return getCustomMock('nickname', randomSeed);
      } else return faker.name.lastName;
    },
  },
  name: () => faker.name.findName(),
  informalName: () => faker.name.findName(),
  phone: () => faker.phone.phoneNumber(),
  primaryEmail: () => faker.internet.email(),
  initials: () => faker.address.countryCode(),
  emailAddress: () => faker.internet.email(),
  username: () => faker.internet.userName(),
  startDate: () => faker.date.past(),
  createdOn: () => faker.date.past(),
  createdAt: () => faker.date.past(),
  createAt: () => faker.date.past(),
  gmtCreate: () => faker.date.past(),
  updatedAt: () => faker.date.past(),
  updateAt: () => faker.date.past(),
  gmtModified: () => faker.date.past(),
  endDate: () => faker.date.future(),
  href: () => faker.internet.url(),
};

Object.keys(fakeFunctions).forEach(key => {
  const value = fakeFunctions[key];
  if (typeof fakeFunctions[key] === 'function')
    fakeFunctions[key] = { args: [], func: value };
});

Object.keys(smartFakerFunctions).forEach(key => {
  const value = smartFakerFunctions[key];
  if (typeof smartFakerFunctions[key] === 'function')
    smartFakerFunctions[key] = { args: [], func: value };
});

export function fakeValue(type, options?, locale?) {
  const fakeGenerator = fakeFunctions[type];
  if (fakeGenerator) {
    const argNames = fakeGenerator.args;
    //TODO: add check
    const callArgs = argNames.map(name => options[name]);

    const localeBackup = faker.locale;
    //faker.setLocale(locale || localeBackup);
    faker.locale = locale || localeBackup;
    const result = fakeGenerator.func(...callArgs);
    //faker.setLocale(localeBackup);
    faker.locale = localeBackup;
    return result;
  }
  return null;
}
export function smartFakeValue(
  fieldName: string,
  type: GraphQLLeafType,
  randomSeed: number
) {
  let fakeGenerator = fakeFunctions[fieldName];
  // 先直接匹配
  if (!fakeGenerator) {
    // 正则匹配
    fakeGenerator =
      smartFakerFunctions[
        Object.keys(smartFakerFunctions).find(key => fieldName.match(key))
      ];
  }
  if (fakeGenerator) {
    // return fakeGenerator.func(type, ...fakeGenerator.args);
    return fakeGenerator.func(type, randomSeed);
  }
  return null;
}
