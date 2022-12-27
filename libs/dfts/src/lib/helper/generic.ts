export function g_uncheckedCast<SrcType, DstType>(ob: SrcType): DstType {
  return ob as unknown as DstType;
}
