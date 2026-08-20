import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import DiffText from '../DiffText.jsx';

export default function ClassicTemplate({
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
  proposalViewMode
}) {
  return (
    <Document title={`CV_${personal.name || 'Resume'}`} author={personal.name || 'CVBuilder'}>
      <Page size="A4" style={[styles.page, { fontFamily }]}>

        {/* HEADER */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <DiffText diff={personal._diff?.name} proposalViewMode={proposalViewMode} style={styles.name}>
              {personal.name || 'Your Full Name'}
            </DiffText>
            <DiffText diff={personal._diff?.title} proposalViewMode={proposalViewMode} style={styles.title}>
              {personal.title || 'Professional Title'}
            </DiffText>
            <View style={styles.contactsRow}>
              {personal.email && (
                <DiffText diff={personal._diff?.email} proposalViewMode={proposalViewMode} style={styles.contactItem}>
                  {personal.email}
                </DiffText>
              )}
              {personal.phone && (
                <DiffText diff={personal._diff?.phone} proposalViewMode={proposalViewMode} style={styles.contactItem}>
                  • {personal.phone}
                </DiffText>
              )}
              {personal.address && (
                <DiffText diff={personal._diff?.address} proposalViewMode={proposalViewMode} style={styles.contactItem}>
                  • {personal.address}
                </DiffText>
              )}
              {personal.website && (
                <DiffText diff={personal._diff?.website} proposalViewMode={proposalViewMode} style={styles.contactItem}>
                  • {personal.website}
                </DiffText>
              )}
              {personal.linkedin && (
                <DiffText diff={personal._diff?.linkedin} proposalViewMode={proposalViewMode} style={styles.contactItem}>
                  • {personal.linkedin}
                </DiffText>
              )}
            </View>
          </View>

          {showQrCode && (
            <View style={styles.qrContainer}>
              <Image src={qrCodeUrl} style={styles.qrImage} />
              <Text style={styles.qrLabel}>Live CV Link</Text>
            </View>
          )}
        </View>

        {/* SUMMARY */}
        {personal.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={45}>Professional Summary</Text>
            <DiffText diff={personal._diff?.summary} proposalViewMode={proposalViewMode} style={styles.paragraph}>
              {personal.summary}
            </DiffText>
          </View>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={45}>Work Experience</Text>
            {experience.map((exp, expIdx) => (
              <View key={exp.id || expIdx} style={styles.itemGroup} wrap={false}>
                <View style={styles.itemHead}>
                  <Text style={styles.itemTitle}>
                    <DiffText diff={exp._diff?.role} proposalViewMode={proposalViewMode} style={styles.itemTitle}>
                      {exp.role}
                    </DiffText>
                    {' '}
                    <DiffText diff={exp._diff?.company} proposalViewMode={proposalViewMode} style={styles.itemSub}>
                      — {exp.company}
                    </DiffText>
                  </Text>
                  <DiffText diff={exp._diff?.start || exp._diff?.end} proposalViewMode={proposalViewMode} style={styles.itemDate}>
                    {exp.start} – {exp.end}
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
                        <Text style={styles.bulletPoint}>•</Text>
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
            <Text style={styles.sectionTitle} minPresenceAhead={45}>Education</Text>
            {education.map((edu, eduIdx) => (
              <View key={edu.id || eduIdx} style={styles.itemGroup} wrap={false}>
                <View style={styles.itemHead}>
                  <Text style={styles.itemTitle}>
                    <DiffText diff={edu._diff?.degree} proposalViewMode={proposalViewMode} style={styles.itemTitle}>
                      {edu.degree}
                    </DiffText>
                    {' '}
                    <DiffText diff={edu._diff?.institution} proposalViewMode={proposalViewMode} style={styles.itemSub}>
                      — {edu.institution}
                    </DiffText>
                  </Text>
                  <DiffText diff={edu._diff?.start || edu._diff?.end} proposalViewMode={proposalViewMode} style={styles.itemDate}>
                    {edu.start} – {edu.end}
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

        {/* SKILLS */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={45}>Skills & Competencies</Text>
            {skills.map((skillGroup, sIdx) => (
              <View key={skillGroup.id || sIdx} style={styles.skillsGroup} wrap={false}>
                <DiffText diff={skillGroup._diff?.category} proposalViewMode={proposalViewMode} style={styles.skillCategoryTitle}>
                  {skillGroup.category}:
                </DiffText>
                <View style={styles.tagsRow}>
                  {(skillGroup.items || []).map((item, iIdx) => (
                    <DiffText key={iIdx} diff={skillGroup._diff?.items?.[iIdx] || skillGroup._diff?.group || skillGroup._diff} proposalViewMode={proposalViewMode} style={styles.tagPill}>
                      {item}
                    </DiffText>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* LANGUAGES */}
        {languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={45}>Languages</Text>
            <View style={styles.languagesRow}>
              {languages.map((lang, lIdx) => (
                <DiffText key={lang.id || lIdx} diff={lang._diff?.name || lang._diff?.level || lang._diff?.item || lang._diff} proposalViewMode={proposalViewMode} style={styles.langItem}>
                  {lang.name}: {lang.level}
                </DiffText>
              ))}
            </View>
          </View>
        )}

        {/* AWARDS */}
        {awards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={45}>Honors & Awards</Text>
            {awards.map((awd, awdIdx) => (
              <View key={awd.id || awdIdx} style={styles.itemGroup} wrap={false}>
                <View style={styles.itemHead}>
                  <Text style={styles.itemTitle}>
                    <DiffText diff={awd._diff?.title} proposalViewMode={proposalViewMode} style={styles.itemTitle}>
                      {awd.title}
                    </DiffText>
                    {' '}
                    <DiffText diff={awd._diff?.issuer} proposalViewMode={proposalViewMode} style={styles.itemSub}>
                      — {awd.issuer}
                    </DiffText>
                  </Text>
                  <DiffText diff={awd._diff?.date} proposalViewMode={proposalViewMode} style={styles.itemDate}>
                    {awd.date}
                  </DiffText>
                </View>
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
            <DiffText diff={sec._diff?.title} proposalViewMode={proposalViewMode} style={styles.sectionTitle} minPresenceAhead={45}>
              {sec.title}
            </DiffText>
            {(sec.items || []).map((item, itemIdx) => (
              <View key={item.id || itemIdx} style={styles.itemGroup} wrap={false}>
                <View style={styles.itemHead}>
                  <Text style={styles.itemTitle}>
                    <DiffText diff={item._diff?.heading} proposalViewMode={proposalViewMode} style={styles.itemTitle}>
                      {item.heading}
                    </DiffText>
                    {item.subheading && (
                      <DiffText diff={item._diff?.subheading} proposalViewMode={proposalViewMode} style={styles.itemSub}>
                        — {item.subheading}
                      </DiffText>
                    )}
                  </Text>
                  <DiffText diff={item._diff?.start || item._diff?.end || item._diff?.date} proposalViewMode={proposalViewMode} style={styles.itemDate}>
                    {item.start && item.end ? `${item.start} – ${item.end}` : item.start || item.end || item.date || ''}
                  </DiffText>
                </View>
                {item.detail && (
                  <DiffText diff={item._diff?.detail} proposalViewMode={proposalViewMode} style={styles.itemDesc}>
                    {item.detail}
                  </DiffText>
                )}
              </View>
            ))}
          </View>
        ))}

        {/* FOOTER */}
        <View style={styles.pageFooter} fixed>
          <Text>CV Document • Generated via @react-pdf/renderer</Text>
          <Text render={({ pageNumber, totalPages }) => `Pagină ${pageNumber} din ${totalPages}`} />
        </View>

      </Page>
    </Document>
  );
}
