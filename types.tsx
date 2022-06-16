import {StackScreenProps, StackNavigationProp} from '@react-navigation/stack';
import {
  NavigatorScreenParams,
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {ICircle, Members} from './server/types';

export type StackParamList = {
  Login: undefined;
  CreateAccount: undefined;
  SplashOptions: undefined;
  ForgotPassword: undefined;
  EditProfile: undefined;
  Home: undefined;
  Circle: undefined;
  Dashboard: undefined;
  Splash: undefined;
  CreateCircle: undefined;
  CircleDashboard: {id: string; headerTitle: string};
  CircleSettings: undefined;
  ViewMembers: undefined;
  InviteMembers: undefined;
  EditCircle: undefined;
  WalletDashboard: undefined;
  Fund: undefined;
  Withdraw: undefined;
  Transactions: undefined;
  Settings: undefined;
  PersonalInformation: undefined;
  NotificationSettings: undefined;
  ChangePassword: undefined;
  TermsAndConditions: undefined;
  PrivacyPolicy: undefined;
  BankAccount: undefined;
};

// export type TabParamList = {
//   Home: NavigatorScreenParams<StackParamList>;
// };

// export type Props = CompositeNavigationProp<
//   BottomTabNavigationProp<TabParamList, 'Home'>,
//   StackNavigationProp<StackParamList>
// >;

type RouteNavigationProps = RouteProp<StackParamList, 'Home'>;
type StackNavigationProps = StackNavigationProp<StackParamList, 'Home'>;

export type Props = {
  route?: RouteNavigationProps;
  navigation: StackNavigationProps;
};

export interface DashCardProps {
  title: string;
  subtitle: string;
  value: string | number;
  wallet?: boolean
}

export interface SphereProps {
  title: string;
  id: string;
  circle: ICircle;
}

export interface SettingItemProps {
  title: string;
  toggle?: boolean;
  deletable?: boolean;
  member?: Members;
  next?: string;
  params?: object;
  deactivated?: boolean;
  debtors?: boolean;
  paused?: boolean;
  action?: (
    _id: any,
    circleId: any,
    name: any,
  ) => Promise<void | {status: any; error: any} | undefined>;
  owner?: boolean;
  circle?: Members;
}

export interface UserSearchEntryProps {
  id: string;
  name: string;
  email: string;
  invitedMomentsAgo: boolean;
  storeInvite: (id: string) => void;
}

export interface WalletBarProps {
  balance: number;
}

export interface TransactionItemProps {
  dateTime: string;
  initiator: string;
  debit: boolean;
  name: string;
  amount: string;
}
