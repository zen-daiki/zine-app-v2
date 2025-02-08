import { memo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const Section = memo(({ title, children }: { title: string; children: React.ReactNode }) => (
  <>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </>
));

const List = memo(({ items }: { items: string[] }) => (
  <View style={styles.listContainer}>
    {items.map((item, index) => (
      <Text key={index} style={styles.listItem}>・{item}</Text>
    ))}
  </View>
));

const ContactInfo = memo(() => (
  <View style={styles.contactInfo}>
    <Text style={styles.contactItem}>住所：</Text>
    <Text style={styles.contactItem}>社名：</Text>
    <Text style={styles.contactItem}>代表取締役：</Text>
    <Text style={styles.contactItem}>担当部署：</Text>
    <Text style={styles.contactItem}>Eメールアドレス：</Text>
  </View>
));

export default function PrivacyScreen() {
  return (
    <ScrollView 
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.content}>
        <Text style={styles.title}>プライバシーポリシー</Text>
        
        <Text style={styles.paragraph}>
          ＿＿＿＿＿＿＿＿（以下，「当社」といいます。）は，本ウェブサイト上で提供するサービス（以下,「本サービス」といいます。）における，ユーザーの個人情報の取扱いについて，以下のとおりプライバシーポリシー（以下，「本ポリシー」といいます。）を定めます。
        </Text>

        <Section title="第1条（個人情報）">
          <Text style={styles.paragraph}>
            「個人情報」とは，個人情報保護法にいう「個人情報」を指すものとし，生存する個人に関する情報であって，当該情報に含まれる氏名，生年月日，住所，電話番号，連絡先その他の記述等により特定の個人を識別できる情報及び容貌，指紋，声紋にかかるデータ，及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
          </Text>
        </Section>

        <Section title="第2条（個人情報の収集方法）">
          <Text style={styles.paragraph}>
            当社は，ユーザーが利用登録をする際に氏名，生年月日，住所，電話番号，メールアドレス，銀行口座番号，クレジットカード番号，運転免許証番号などの個人情報をお尋ねすることがあります。また，ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を,当社の提携先（情報提供元，広告主，広告配信先などを含みます。以下，｢提携先｣といいます。）などから収集することがあります。
          </Text>
        </Section>

        <Section title="第3条（個人情報を収集・利用する目的）">
          <Text style={styles.paragraph}>当社が個人情報を収集・利用する目的は，以下のとおりです。</Text>
          <List items={[
            '当社サービスの提供・運営のため',
            'ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）',
            'ユーザーが利用中のサービスの新機能，更新情報，キャンペーン等及び当社が提供する他のサービスの案内のメールを送付するため',
            'メンテナンス，重要なお知らせなど必要に応じたご連絡のため',
            '利用規約に違反したユーザーや，不正・不当な目的でサービスを利用しようとするユーザーの特定をし，ご利用をお断りするため',
            'ユーザーにご自身の登録情報の閲覧や変更，削除，ご利用状況の閲覧を行っていただくため',
            '有料サービスにおいて，ユーザーに利用料金を請求するため',
            '上記の利用目的に付随する目的'
          ]} />
        </Section>

        <Section title="第4条（利用目的の変更）">
          <Text style={styles.paragraph}>
            当社は，利用目的が変更前と関連性を有すると合理的に認められる場合に限り，個人情報の利用目的を変更するものとします。{'\n'}
            利用目的の変更を行った場合には，変更後の目的について，当社所定の方法により，ユーザーに通知し，または本ウェブサイト上に公表するものとします。
          </Text>
        </Section>

        <Section title="第5条（個人情報の第三者提供）">
          <Text style={styles.paragraph}>
            当社は，次に掲げる場合を除いて，あらかじめユーザーの同意を得ることなく，第三者に個人情報を提供することはありません。ただし，個人情報保護法その他の法令で認められる場合を除きます。
          </Text>
          <List items={[
            '人の生命，身体または財産の保護のために必要がある場合であって，本人の同意を得ることが困難であるとき',
            '公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって，本人の同意を得ることが困難であるとき',
            '国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって，本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき'
          ]} />
        </Section>

        <Section title="第6条（個人情報の開示）">
          <Text style={styles.paragraph}>
            当社は，本人から個人情報の開示を求められたときは，本人に対し，遅滞なくこれを開示します。ただし，開示することにより次のいずれかに該当する場合は，その全部または一部を開示しないこともあり，開示しない決定をした場合には，その旨を遅滞なく通知します。なお，個人情報の開示に際しては，1件あたり1，000円の手数料を申し受けます。
          </Text>
        </Section>

        <Section title="第7条（個人情報の訂正および削除）">
          <Text style={styles.paragraph}>
            ユーザーは，当社の保有する自己の個人情報が誤った情報である場合には，当社が定める手続きにより，当社に対して個人情報の訂正，追加または削除（以下，「訂正等」といいます。）を請求することができます。
          </Text>
        </Section>

        <Section title="第8条（個人情報の利用停止等）">
          <Text style={styles.paragraph}>
            当社は，本人から，個人情報が，利用目的の範囲を超えて取り扱われているという理由，または不正の手段により取得されたものであるという理由により，その利用の停止または消去（以下，「利用停止等」といいます。）を求められた場合には，遅滞なく必要な調査を行います。
          </Text>
        </Section>

        <Section title="第9条（プライバシーポリシーの変更）">
          <Text style={styles.paragraph}>
            本ポリシーの内容は，法令その他本ポリシーに別段の定めのある事項を除いて，ユーザーに通知することなく，変更することができるものとします。{'\n'}
            当社が別途定める場合を除いて，変更後のプライバシーポリシーは，本ウェブサイトに掲載したときから効力を生じるものとします。
          </Text>
        </Section>

        <Section title="第10条（お問い合わせ窓口）">
          <Text style={styles.paragraph}>本ポリシーに関するお問い合わせは，下記の窓口までお願いいたします。</Text>
          <ContactInfo />
        </Section>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
    marginBottom: 10,
  },
  listContainer: {
    marginLeft: 10,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
    marginBottom: 5,
  },
  contactInfo: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#2f3437',
    borderRadius: 8,
  },
  contactItem: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 5,
  },
});
