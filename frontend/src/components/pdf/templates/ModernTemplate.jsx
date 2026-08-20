import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import DiffText from '../DiffText.jsx';

export default function ModernTemplate({
  personal,
  experience,
  education,
  skills,
  languages,
  awards,
  customSections,
  hobbies,
  styles,
  fontFamily,
  showQrCode,
  qrCodeUrl,
  avatarUrl,
  proposalViewMode
}) {
  return (
    <Document title={`CV_${personal.name || 'Resume'}`} author={personal.name || 'CVBuilder'}>
      <Page size="A4" style={[styles.page, { fontFamily }]}>

        {/* MODERN HEADER CARD */}
        <View style={styles.modernHeader}>
          <Image src={avatarUrl} style={styles.modernAvatar} />

          <View style={styles.modernHeaderMain}>
            <DiffText diff={personal._diff?.name} proposalViewMode={proposalViewMode} style={styles.modernName}>
              {personal.name || 'Your Full Name'}
            </DiffText>
            <DiffText diff={personal._diff?.title} proposalViewMode={proposalViewMode} style={styles.modernTitle}>
              {personal.title || 'Professional Title'}
            </DiffText>
            {personal.summary && (
              <DiffText diff={personal._diff?.summary} proposalViewMode={proposalViewMode} style={styles.modernSummary}>
                {personal.summary}
              </DiffText>
            )}
          </View>

          {/* TOP RIGHT QR CODE */}
          {showQrCode && (
            <View style={styles.modernQrContainer}>
              <Image src={qrCodeUrl} style={styles.modernQrImage} />
              <Text style={styles.modernQrLabel}>Live CV Link</Text>
            </View>
          )}
        </View>

        {/* MODERN CONTACT STRIP */}
        <View style={styles.modernContactBar}>
          {personal.phone && (
            <DiffText diff={personal._diff?.phone} proposalViewMode={proposalViewMode} style={styles.modernContactItem}>
              <Text style={styles.modernContactIcon}>📞 </Text>{personal.phone}
            </DiffText>
          )}
          {personal.email && (
            <DiffText diff={personal._diff?.email} proposalViewMode={proposalViewMode} style={styles.modernContactItem}>
              <Text style={styles.modernContactIcon}>✉ </Text>{personal.email}
            </DiffText>
          )}
          {personal.linkedin && (
            <DiffText diff={personal._diff?.linkedin} proposalViewMode={proposalViewMode} style={styles.modernContactItem}>
              <Text style={styles.modernContactIcon}>in </Text>{personal.linkedin}
            </DiffText>
          )}
          {personal.address && (
            <DiffText diff={personal._diff?.address} proposalViewMode={proposalViewMode} style={styles.modernContactItem}>
              <Text style={styles.modernContactIcon}>📍 </Text>{personal.address}
            </DiffText>
          )}
          {personal.website && (
            <DiffText diff={personal._diff?.website} proposalViewMode={proposalViewMode} style={styles.modernContactItem}>
              <Text style={styles.modernContactIcon}>🌐 </Text>{personal.website}
            </DiffText>
          )}
        </View>

        {/* TWO COLUMN BODY */}
        <View style={styles.modernBody}>
          {/* LEFT COLUMN: Experience, Education, Achievements, Custom */}
          <View style={styles.modernLeftCol}>
            {/* WORK EXPERIENCE */}
            {experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.modernSectionTitle} minPresenceAhead={45}>Work Experience</Text>
                {experience.map((exp, expIdx) => (
                  <View key={exp.id || expIdx} style={styles.itemGroup} wrap={false}>
                    <View style={styles.itemHead}>
                      <Text style={styles.itemTitle}>
                        <DiffText diff={exp._diff?.role} proposalViewMode={proposalViewMode} style={styles.itemTitle}>
                          {exp.role}
                        </DiffText>
                      </Text>
                      <DiffText diff={exp._diff?.start || exp._diff?.end} proposalViewMode={proposalViewMode} style={styles.itemDate}>
                        {exp.start} – {exp.end}
                      </DiffText>
                    </View>

                    <View style={{ marginBottom: 2 }}>
                      <DiffText diff={exp._diff?.company} proposalViewMode={proposalViewMode} style={styles.itemSub}>
                        {exp.company} {exp.location ? `— ${exp.location}` : ''}
                      </DiffText>
                    </View>

                    {exp.description && (
                      <DiffText diff={exp._diff?.description} proposalViewMode={proposalViewMode} style={styles.itemDesc}>
                        {exp.description}
                      </DiffText>
                    )}

                    <View style={styles.bulletList}>
                      {(exp.bullets || []).map((bulletText, bulletIdx) => {
                        const bulletDiff = exp._diff?.bullets?.[bulletIdx];

                        if (bulletDiff?.op === 'add' && proposalViewMode === 'before') return null;
                        if (bulletDiff?.op === 'remove' && proposalViewMode === 'after') return null;

                        return (
                          <View key={bulletIdx} style={styles.bulletItem}>
                            <Text style={styles.modernBulletPoint}>•</Text>
                            <View style={{ flex: 1 }}>
                              <DiffText
                                diff={bulletDiff}
                                proposalViewMode={proposalViewMode}
                                style={styles.bulletText}
                              >
                                {bulletText}
                              </DiffText>
                            </View>
                          </View>
                        );
                      })}
                    </View>

                    {exp.skills && exp.skills.length > 0 && (
                      <View style={styles.tagsRow}>
                        {exp.skills.map((sk, sIdx) => (
                          <DiffText key={sIdx} diff={exp._diff?.skills?.[sIdx]} proposalViewMode={proposalViewMode} style={styles.tagPill}>
                            {sk}
                          </DiffText>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* EDUCATION */}
            {education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.modernSectionTitle} minPresenceAhead={45}>Education</Text>
                {education.map((edu, eduIdx) => (
                  <View key={edu.id || eduIdx} style={styles.itemGroup} wrap={false}>
                    <View style={styles.itemHead}>
                      <Text style={styles.itemTitle}>
                        <DiffText diff={edu._diff?.degree} proposalViewMode={proposalViewMode} style={styles.itemTitle}>
                          {edu.degree}
                        </DiffText>
                      </Text>
                      <DiffText diff={edu._diff?.start || edu._diff?.end} proposalViewMode={proposalViewMode} style={styles.itemDate}>
                        {edu.start} – {edu.end}
                      </DiffText>
                    </View>
                    <View style={{ marginBottom: 2 }}>
                      <DiffText diff={edu._diff?.institution} proposalViewMode={proposalViewMode} style={styles.itemSub}>
                        {edu.institution} {edu.location ? `— ${edu.location}` : ''}
                      </DiffText>
                    </View>
                    {edu.description && (
                      <DiffText diff={edu._diff?.description} proposalViewMode={proposalViewMode} style={styles.itemDesc}>
                        {edu.description}
                      </DiffText>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* AWARDS & ACHIEVEMENTS */}
            {awards.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.modernSectionTitle} minPresenceAhead={45}>Achievements & Awards</Text>
                {awards.map((awd, awdIdx) => (
                  <View key={awd.id || awdIdx} style={styles.itemGroup} wrap={false}>
                    <View style={styles.itemHead}>
                      <Text style={styles.itemTitle}>
                        <DiffText diff={awd._diff?.title} proposalViewMode={proposalViewMode} style={styles.itemTitle}>
                          {awd.title}
                        </DiffText>
                      </Text>
                      <DiffText diff={awd._diff?.date} proposalViewMode={proposalViewMode} style={styles.itemDate}>
                        {awd.date}
                      </DiffText>
                    </View>
                    {awd.issuer && (
                      <DiffText diff={awd._diff?.issuer} proposalViewMode={proposalViewMode} style={styles.itemSub}>
                        {awd.issuer}
                      </DiffText>
                    )}
                    {awd.description && (
                      <DiffText diff={awd._diff?.description} proposalViewMode={proposalViewMode} style={styles.itemDesc}>
                        {awd.description}
                      </DiffText>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* CUSTOM SECTIONS */}
            {customSections.map((sec, secIdx) => (
              <View key={sec.id || secIdx} style={styles.section}>
                <DiffText diff={sec._diff?.title} proposalViewMode={proposalViewMode} style={styles.modernSectionTitle} minPresenceAhead={45}>
                  {sec.title}
                </DiffText>
                {(sec.items || []).map((item, itemIdx) => (
                  <View key={item.id || itemIdx} style={styles.itemGroup} wrap={false}>
                    <View style={styles.itemHead}>
                      <Text style={styles.itemTitle}>
                        <DiffText diff={item._diff?.heading} proposalViewMode={proposalViewMode} style={styles.itemTitle}>
                          {item.heading}
                        </DiffText>
                      </Text>
                      <DiffText diff={item._diff?.start || item._diff?.end || item._diff?.date} proposalViewMode={proposalViewMode} style={styles.itemDate}>
                        {item.start && item.end ? `${item.start} – ${item.end}` : item.start || item.end || item.date || ''}
                      </DiffText>
                    </View>
                    {item.subheading && (
                      <DiffText diff={item._diff?.subheading} proposalViewMode={proposalViewMode} style={styles.itemSub}>
                        {item.subheading}
                      </DiffText>
                    )}
                    {item.detail && (
                      <DiffText diff={item._diff?.detail} proposalViewMode={proposalViewMode} style={styles.itemDesc}>
                        {item.detail}
                      </DiffText>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* RIGHT COLUMN: Skills, Languages, Hobbies */}
          <View style={styles.modernRightCol}>
            {/* SKILLS */}
            {skills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.modernSectionTitle} minPresenceAhead={45}>Skills</Text>
                {skills.map((skillGroup, sIdx) => (
                  <View key={skillGroup.id || sIdx} style={styles.skillsGroup} wrap={false}>
                    <DiffText diff={skillGroup._diff?.category} proposalViewMode={proposalViewMode} style={styles.skillCategoryTitle}>
                      {skillGroup.category}
                    </DiffText>
                    <View style={{ marginLeft: 2, marginBottom: 6 }}>
                      {(skillGroup.items || []).map((item, iIdx) => (
                        <View key={iIdx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2.5 }}>
                          <Text style={styles.modernBulletPoint}>•</Text>
                          <DiffText diff={skillGroup._diff?.items?.[iIdx]} proposalViewMode={proposalViewMode} style={{ fontSize: 8.5, color: '#334155', flex: 1 }}>
                            {item}
                          </DiffText>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* LANGUAGES */}
            {languages.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.modernSectionTitle} minPresenceAhead={45}>Languages</Text>
                <View style={{ marginLeft: 2 }}>
                  {languages.map((lang, lIdx) => (
                    <View key={lang.id || lIdx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                      <Text style={styles.modernBulletPoint}>•</Text>
                      <DiffText diff={lang._diff?.name || lang._diff?.level} proposalViewMode={proposalViewMode} style={{ fontSize: 8.5, color: '#334155', flex: 1 }}>
                        {lang.name}: <Text style={{ fontStyle: 'italic', color: '#64748b' }}>{lang.level}</Text>
                      </DiffText>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* HOBBIES / INTERESTS */}
            {hobbies.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.modernSectionTitle} minPresenceAhead={45}>Hobbies & Interests</Text>
                <View style={{ marginLeft: 2 }}>
                  {hobbies.map((hb, hIdx) => (
                    <View key={hb.id || hIdx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                      <Text style={styles.modernBulletPoint}>•</Text>
                      <DiffText diff={hb._diff?.name || hb._diff} proposalViewMode={proposalViewMode} style={{ fontSize: 8.5, color: '#334155', flex: 1 }}>
                        {typeof hb === 'string' ? hb : hb.name}
                      </DiffText>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.section}>
                <Text style={styles.modernSectionTitle} minPresenceAhead={45}>Hobbies</Text>
                <View style={{ marginLeft: 2 }}>
                  {['Football', 'Open Source Projects', 'Tech Blogging'].map((hb, hIdx) => (
                    <View key={hIdx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                      <Text style={styles.modernBulletPoint}>•</Text>
                      <Text style={{ fontSize: 8.5, color: '#334155', flex: 1 }}>{hb}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.pageFooter} fixed>
          <Text>CV Document • Generated via @react-pdf/renderer</Text>
          <Text render={({ pageNumber, totalPages }) => `Pagină ${pageNumber} din ${totalPages}`} />
        </View>

      </Page>
    </Document>
  );
}
