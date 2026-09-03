import { courseIndex } from '../data/course';
import LineSwatch from './LineSwatch';
import { useBilingual, useStore } from '../state/store';

/**
 * The whole course on one screen: twenty-six days, the channels each teaches,
 * and — for the thirteen regional days — a way through to that region's
 * magnified reading of the figure.
 *
 * Every column is derived (see data/course.ts), so this table cannot claim a
 * day teaches a region the data does not put there.
 */
export default function CourseIndex({
  selectedDayId,
  onSelect,
}: {
  selectedDayId: string;
  onSelect: (index: number) => void;
}) {
  const t = useBilingual();
  const { progress, setRoute } = useStore();
  const entries = courseIndex();

  return (
    <div className="course-index">
      <table>
        <caption className="sr-only">
          {t('課程總目錄', 'Course index')}
        </caption>
        <thead>
          <tr>
            <th scope="col">{t('日', 'Day')}</th>
            <th scope="col">{t('主題', 'Subject')}</th>
            <th scope="col">{t('經脈', 'Channels')}</th>
            <th scope="col" className="num">
              {t('穴數', 'Points')}
            </th>
            <th scope="col">{t('分區', 'Region')}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => {
            const done = progress.completedDayIds.includes(e.day.id);
            const current = e.day.id === selectedDayId;
            return (
              <tr key={e.day.id} aria-current={current ? 'true' : undefined}>
                <td>
                  <button
                    type="button"
                    className={current ? 'linky current' : 'linky'}
                    onClick={() => onSelect(i)}
                  >
                    {/* Named in full: a button called "13" tells a screen
                        reader nothing about what it does. */}
                    {t(`第 ${e.day.dayNumber} 天`, `Day ${e.day.dayNumber}`)}
                    {done ? ' ✓' : ''}
                  </button>
                </td>
                <td>
                  <button type="button" className="linky subject" onClick={() => onSelect(i)}>
                    {t(e.day.titleZhHant, e.day.titleEn)}
                  </button>
                </td>
                <td>
                  <span className="course-rails">
                    {e.channels.map((m) => (
                      <LineSwatch key={m.id} meridian={m} width={14} />
                    ))}
                  </span>
                </td>
                {/* Review, exam and the tidal timetable declare no channel of
                    their own; a count of 0 would read as missing data. */}
                <td className="num faint">{e.channels.length === 0 ? '—' : e.pointCount}</td>
                <td>
                  {e.region ? (
                    <button
                      type="button"
                      className="chip linky"
                      onClick={() => setRoute('details', e.region!.key)}
                    >
                      {t(e.region.nameZhHant, e.region.nameEn)} →
                    </button>
                  ) : (
                    <span className="faint">
                      {e.channels.length === 0
                        ? t('綜合', 'Across the course')
                        : t('整條經脈', 'Whole channel')}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="faint" style={{ margin: 0 }}>
        {t(
          '前十三天走經脈，後十三天走分區——同樣 362 個穴，換一個方向再認一次。「穴數」在經脈日指該經全部的穴，在分區日指該區的穴。',
          'The first thirteen days follow the channels and the last thirteen follow the regions — the same 362 points, learned a second time from another direction. The Points column counts a channel’s whole length on a channel day, and a region’s contents on a regional one.',
        )}
      </p>
    </div>
  );
}
